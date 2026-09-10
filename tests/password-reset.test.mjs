import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);
function setup({
  user = { id: "owner" },
  sendError = null,
  updateError = null,
} = {}) {
  const calls = [];
  const exports = {};
  const schemaExports = {};
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync("lib/password-schema.ts", "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText,
    { exports: schemaExports, require },
  );
  const imports = {
    "@/lib/password-schema": schemaExports,
    "next/headers": {
      headers: async () => new Headers({ origin: "https://omnibot.example" }),
    },
    "@/lib/supabase/server": {
      createClient: async () => ({
        auth: {
          resetPasswordForEmail: async (...args) => {
            calls.push(["send", ...args]);
            return { error: sendError };
          },
          getUser: async () => ({ data: { user } }),
          updateUser: async (values) => {
            calls.push(["update", values]);
            return { error: updateError };
          },
        },
      }),
    },
  };
  const code = ts.transpileModule(
    fs.readFileSync("app/actions/password.ts", "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => imports[name] ?? require(name),
    URL,
    process: { env: {} },
  });
  return { api: exports, calls };
}
function form(values) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}
test("validates email and builds the recovery callback", async () => {
  const { api, calls } = setup();
  assert.ok(
    (await api.requestPasswordReset({}, form({ email: "invalid" }))).error,
  );
  assert.equal(calls.length, 0);
  assert.ok(
    (await api.requestPasswordReset({}, form({ email: "person@example.com" })))
      .success,
  );
  assert.equal(
    calls[0][2].redirectTo,
    "https://omnibot.example/auth/callback?next=%2Freset-password",
  );
});
test("password updates require a valid session and matching passwords", async () => {
  const { api, calls } = setup();
  assert.ok(
    (
      await api.resetPassword(
        {},
        form({ password: "short", confirmPassword: "short" }),
      )
    ).error,
  );
  assert.ok(
    (
      await api.resetPassword(
        {},
        form({
          password: "Valid-password1",
          confirmPassword: "different-password",
        }),
      )
    ).error,
  );
  assert.equal(calls.length, 0);
  const loggedOut = setup({ user: null });
  assert.ok(
    (
      await loggedOut.api.resetPassword(
        {},
        form({ password: "Valid-password1", confirmPassword: "Valid-password1" }),
      )
    ).error,
  );
  assert.equal(loggedOut.calls.length, 0);
  assert.ok(
    (
      await api.resetPassword(
        {},
        form({ password: "Valid-password1", confirmPassword: "Valid-password1" }),
      )
    ).success,
  );
  assert.equal(calls[0][1].password, "Valid-password1");
});
test("provider errors do not report success", async () => {
  const { api } = setup({
    sendError: { message: "rate limited" },
    updateError: { code: "same_password" },
  });
  assert.ok(
    (await api.requestPasswordReset({}, form({ email: "person@example.com" })))
      .error,
  );
  assert.match(
    (
      await api.resetPassword(
        {},
        form({ password: "Valid-password1", confirmPassword: "Valid-password1" }),
      )
    ).error,
    /different/,
  );
});

test("rejects passwords missing each required character type", async () => {
  const { api, calls } = setup();
  for (const password of ["password1!", "PASSWORD1!", "Password!!", "Password12", "Password1 "]) {
    assert.ok((await api.resetPassword({}, form({ password, confirmPassword: password }))).error);
  }
  assert.equal(calls.length, 0);
});
