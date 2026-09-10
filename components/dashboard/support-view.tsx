import Link from "next/link";
import { CircleHelp, Mail } from "lucide-react";

export function SupportView() {
  return (
    <section aria-labelledby="support-title">
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
        We’re here to help
      </p>
      <h1 id="support-title" className="mt-2 text-3xl font-semibold">
        Help & support
      </h1>
      <div className="mt-6 rounded-3xl bg-white p-7">
        <CircleHelp className="mb-5 size-10 text-blue-500" />
        <h2 className="text-xl font-semibold">Find your way around OmniBot</h2>
        <p className="mt-3 text-sm leading-7 text-neutral-500">
          Learn about your portfolio, explore markets, and get started with
          bots.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/workspace"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white"
          >
            Workspace guide
          </Link>
          <Link
            href="/dashboard/automation"
            className="rounded-xl bg-blue-50 px-5 py-3 text-sm font-medium text-blue-700"
          >
            Automation guide
          </Link>
        </div>
      </div>
      <div className="mt-5 rounded-3xl bg-white p-7">
        <h2 className="text-xl font-semibold">Common questions</h2>
        {[
          [
            "Can I place a trade or withdraw funds?",
            "Trading and funding services are not connected yet. Withdrawal forms let you check details but do not submit transfers.",
          ],
          [
            "Are bot drafts saved?",
            "Bot drafts last until you leave or refresh the page. They do not place trades.",
          ],
          [
            "Where do market prices come from?",
            "Prices come from Dexscreener exchange pools and refresh periodically. Wrapped assets and different pools can have different prices.",
          ],
        ].map(([question, answer]) => (
          <details
            key={question}
            className="border-b border-neutral-100 py-5 last:border-0"
          >
            <summary className="cursor-pointer text-sm font-medium">
              {question}
            </summary>
            <p className="mt-3 text-sm leading-7 text-neutral-500">{answer}</p>
          </details>
        ))}
      </div>
      <div className="mt-5 rounded-3xl bg-blue-50 p-7">
        <h2 className="font-semibold">Need more help?</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Email our support team with a description of the issue.
        </p>
        <a
          href="mailto:support@omnidev.co"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-700"
        >
          <Mail className="size-4" />
          support@omnidev.co
        </a>
      </div>
    </section>
  );
}
