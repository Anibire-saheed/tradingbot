import { ChartNoAxesCombined, UserRoundPlus, Wallet } from "lucide-react";

const steps = [
  {
    title: "Create your account",
    description:
      "Sign up with your details and take the first step towards managing your trades with OmniBot.",
    icon: UserRoundPlus,
  },
  {
    title: "Connect your wallet",
    description:
      "Connect your wallet to bring your crypto assets and trading activity together in one place.",
    icon: Wallet,
  },
  {
    title: "Start trading",
    description:
      "Explore market insights, choose your trading bot, and keep track of your portfolio.",
    icon: ChartNoAxesCombined,
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative isolate scroll-mt-8 overflow-hidden bg-[#f7f7f7] px-6 py-16 text-slate-950 md:px-14 lg:py-20"
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 -z-10 h-[530px] w-full text-neutral-200/70"
        viewBox="0 0 1400 530"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {Array.from({ length: 7 }, (_, index) => (
          <path
            key={index}
            d={`M ${90 + index * 18} 530 C 250 ${170 + index * 20}, 850 ${250 + index * 20}, ${1090 + index * 28} -70`}
            stroke="currentColor"
          />
        ))}
      </svg>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          >
            Get started in{" "}
            <span className="text-blue-600">three simple steps.</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            From your first connection to your next trade, here’s how to get
            going.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <li
              key={title}
              className="relative rounded-3xl border border-slate-200 bg-slate-50/70 p-7 lg:p-8"
            >
              <div className="flex items-center justify-between">
                <div className="grid size-14 place-items-center rounded-2xl bg-blue-100 text-blue-600">
                  <Icon
                    aria-hidden="true"
                    className="size-7"
                    strokeWidth={1.7}
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="font-heading text-4xl font-bold text-blue-200"
                >
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-7 font-heading text-xl font-bold">{title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
