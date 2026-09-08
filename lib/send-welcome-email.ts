import "server-only";

import { Pingram } from "pingram";

export async function sendWelcomeEmail(email: string) {
  const pingram = new Pingram({ apiKey: process.env.PINGRAM_API_KEY! });

  const result = await pingram.email.send({
    type: "account_created",
    to: email,
    subject: "Your OmniBot account is ready",
    fromName: "OmniBot",
    html: `
      <div style="background:#050b14;padding:40px 16px;font-family:Arial,sans-serif;">
        <div style="max-width:560px;margin:0 auto;background:#0d1726;border:1px solid #233249;border-radius:20px;padding:40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:28px;">
            Your account is ready
          </h1>
          <p style="margin:16px 0 0;color:#9fb0c7;font-size:16px;line-height:25px;">
            Your email has been verified and your TradingBot account was created successfully.
          </p>
          <div style="margin-top:28px;background:#10271f;border:1px solid #2ee59d;border-radius:12px;padding:16px;color:#2ee59d;font-weight:bold;">
            Account verified successfully
          </div>
          <p style="margin:28px 0 0;color:#667991;font-size:13px;line-height:20px;">
            If you did not create this account, please contact support immediately.
          </p>
        </div>
      </div>
    `,
  });

  if (result.error) throw new Error("Welcome email delivery failed.");
}
