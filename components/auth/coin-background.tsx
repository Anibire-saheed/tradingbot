import Image from "next/image";

const coins = [
  {
    label: "Bitcoin",
    className: "left-[8%] top-[12%] size-24 delay-0",
  },
  {
    label: "Dogecoin",
    className: "left-[18%] bottom-[14%] size-18 delay-700",
  },
  {
    label: "Ethereum",
    className: "right-[13%] top-[18%] size-24 delay-1000",
  },
  {
    label: "Solana",
    className: "right-[22%] bottom-[16%] size-16 delay-1500",
  },
  {
    label: "Memecoin",
    className: "left-[31%] top-[9%] size-16 delay-2000",
  },
  {
    label: "USD Coin",
    className: "right-[6%] bottom-[34%] size-18 delay-500",
  },
];

export function CoinBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {coins.map((coin) => (
        <div
          key={coin.label}
          className={`coin-float absolute opacity-80 drop-shadow-2xl ${coin.className}`}
        >
          <Image
            src="/bitcoin.png"
            alt=""
            width={1536}
            height={1024}
            className="h-full w-full object-contain"
          />
        </div>
      ))}
    </div>
  );
}
