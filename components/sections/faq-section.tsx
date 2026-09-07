import { ChevronDown } from "lucide-react";

const questions = [
  { question: "What is OmniBot?", answer: "OmniBot brings trading insights, portfolio tools, and crypto market opportunities together in one place. Explore the platform to learn how its tools can fit your trading approach." },
  { question: "How do I get started?", answer: "Start with the Get Started link to create your account. The How It Works section walks you through the main steps: creating an account, connecting a wallet, and exploring trading tools." },
  { question: "Do I need trading experience?", answer: "You can explore the platform whether you’re new to crypto or already trade. Take time to understand each tool and the risks involved before committing funds." },
  { question: "Are trading profits guaranteed?", answer: "No. Cryptocurrency prices can change quickly, and trading can result in losses. Automated tools and market insights do not guarantee a profit." },
  { question: "Where can I learn about weekly rewards?", answer: "See the Rewards section for an introduction to the program. Check the applicable eligibility requirements and program terms before participating." },
  { question: "How can I ask another question?", answer: "Use the Contact section below for questions about getting started, trading tools, or the rewards program. Never include passwords, wallet recovery phrases, or private keys in your message." },
];

function FaqIllustration() {
  return (
    <svg viewBox="0 0 600 360" fill="none" role="img" aria-label="A blue trading robot monitoring a candlestick chart" className="mt-9 w-full border border-blue-100 bg-blue-50">
      <defs>
        <linearGradient id="faq-bot-bg" x2="600" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="#DBEAFE" /><stop offset="1" stopColor="#F0F9FF" /></linearGradient>
        <linearGradient id="faq-bot-body" x1="120" y1="100" x2="275" y2="300" gradientUnits="userSpaceOnUse"><stop stopColor="#FFFFFF" /><stop offset="1" stopColor="#93C5FD" /></linearGradient>
        <linearGradient id="faq-bot-screen" x1="110" y1="150" x2="255" y2="210" gradientUnits="userSpaceOnUse"><stop stopColor="#1E3A8A" /><stop offset="1" stopColor="#0F172A" /></linearGradient>
        <filter id="faq-bot-shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#2563EB" floodOpacity="0.16" /></filter>
      </defs>
      <path d="M0 0H600V360H0Z" fill="url(#faq-bot-bg)" />
      <g stroke="#BFDBFE" strokeOpacity="0.4"><path d="M0 80H600M0 140H600M0 200H600M0 260H600M0 320H600M60 0V360M120 0V360M180 0V360M240 0V360M300 0V360M360 0V360M420 0V360M480 0V360M540 0V360" /></g>
      <circle cx="190" cy="179" r="133" fill="#DBEAFE" opacity="0.65" />
      <g filter="url(#faq-bot-shadow)">
        <rect x="267" y="63" width="278" height="216" rx="18" fill="white" stroke="#BFDBFE" strokeWidth="2" />
        <path d="M267 109H545" stroke="#DBEAFE" />
        <circle cx="287" cy="86" r="4" fill="#60A5FA" /><circle cx="301" cy="86" r="4" fill="#93C5FD" /><circle cx="315" cy="86" r="4" fill="#BFDBFE" />
        <path d="M480 85H524" stroke="#93C5FD" strokeWidth="5" strokeLinecap="round" />
        <g stroke="#E2E8F0"><path d="M288 145H526M288 182H526M288 219H526M326 123V249M374 123V249M422 123V249M470 123V249M518 123V249" /></g>
        <path d="M288 228L320 214L348 223L383 185L414 198L449 160L479 173L520 134" stroke="#3B82F6" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {[{ x: 317, y: 187, h: 26 }, { x: 352, y: 196, h: 19 }, { x: 387, y: 157, h: 30 }, { x: 422, y: 171, h: 18 }, { x: 457, y: 127, h: 31 }, { x: 492, y: 137, h: 21 }].map(({ x, y, h }, i) => <g key={x} fill={i % 2 ? "#93C5FD" : "#2563EB"} stroke={i % 2 ? "#60A5FA" : "#2563EB"}><path d={`M${x} ${y - 9}V${y + h + 9}`} strokeWidth="2" /><rect x={x - 6} y={y} width="12" height={h} rx="2" /></g>)}
      </g>
      <ellipse cx="185" cy="316" rx="99" ry="12" fill="#93C5FD" opacity="0.3" />
      <g filter="url(#faq-bot-shadow)">
        <path d="M183 123V100" stroke="#3B82F6" strokeWidth="7" strokeLinecap="round" />
        <circle cx="183" cy="91" r="11" fill="#60A5FA" stroke="white" strokeWidth="4" />
        <rect x="119" y="219" width="132" height="82" rx="30" fill="url(#faq-bot-body)" stroke="#93C5FD" strokeWidth="2" />
        <rect x="143" y="290" width="30" height="22" rx="9" fill="#60A5FA" /><rect x="198" y="290" width="30" height="22" rx="9" fill="#60A5FA" />
        <path d="M123 241Q90 239 93 274M251 239Q275 252 289 225" stroke="#60A5FA" strokeWidth="18" strokeLinecap="round" />
        <rect x="96" y="147" width="19" height="48" rx="9" fill="#60A5FA" /><rect x="253" y="147" width="19" height="48" rx="9" fill="#60A5FA" />
        <rect x="107" y="120" width="155" height="112" rx="35" fill="url(#faq-bot-body)" stroke="#93C5FD" strokeWidth="2" />
        <rect x="121" y="140" width="127" height="70" rx="24" fill="url(#faq-bot-screen)" />
        <rect x="145" y="160" width="14" height="21" rx="7" fill="#67E8F9" /><rect x="209" y="160" width="14" height="21" rx="7" fill="#67E8F9" />
        <path d="M173 189Q184 198 195 189" stroke="#67E8F9" strokeWidth="3" strokeLinecap="round" />
        <circle cx="184" cy="262" r="17" fill="#2563EB" /><path d="M174 263L181 270L195 254" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(447 270)" filter="url(#faq-bot-shadow)"><circle r="33" fill="#DBEAFE" stroke="white" strokeWidth="4" /><text y="13" textAnchor="middle" fontSize="38" fontWeight="bold" fill="#2563EB" fontFamily="Arial, sans-serif">₿</text></g>
      <g stroke="#60A5FA" strokeWidth="3" strokeLinecap="round"><path d="M79 78V94M71 86H87M552 298V310M546 304H558" /></g>
    </svg>
  );
}

export function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-white px-6 text-neutral-950 md:px-14">
      <div className="mx-auto grid max-w-7xl items-start gap-10 border-x border-neutral-200 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-24">
        <div>
          <h2 id="faq-heading" className="text-4xl font-medium leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-[54px]">Frequently asked<br />questions</h2>
          <p className="mt-6 max-w-lg text-lg leading-7 text-neutral-700">Explore answers to common questions about OmniBot, trading tools, and getting started.</p>
          <FaqIllustration />
        </div>
        <div className="grid gap-3">
          {questions.map(({ question, answer }, index) => (
            <details key={question} name="omnibot-faq" open={index === 0} className="group border border-neutral-200 bg-white open:bg-neutral-50">
              <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-lg font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-xl [&::-webkit-details-marker]:hidden">
                {question}<ChevronDown aria-hidden="true" className="size-4 shrink-0 text-neutral-700 transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-6 text-base leading-7 text-neutral-500">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
