"use client";

import { useEffect, useState } from "react";

const message = "Explore crypto opportunities, track the markets, and plan your next move.";

export function AuthTypewriter() {
  const [visibleLength, setVisibleLength] = useState(message.length);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let length = 0;

    function typeNext() {
      if (preference.matches) {
        setVisibleLength(message.length);
        return;
      }
      setVisibleLength(length);
      if (length < message.length) {
        length += 1;
        timer = setTimeout(typeNext, 65);
      } else {
        length = 0;
        timer = setTimeout(typeNext, 3500);
      }
    }

    function restart() {
      clearTimeout(timer);
      length = 0;
      timer = setTimeout(typeNext, 0);
    }

    restart();
    preference.addEventListener("change", restart);
    return () => {
      clearTimeout(timer);
      preference.removeEventListener("change", restart);
    };
  }, []);

  return (
    <p className="absolute right-6 top-7 max-w-sm pl-12 text-right text-xl font-semibold leading-snug tracking-tight text-white xl:text-2xl">
      <span className="sr-only">{message}</span>
      <span aria-hidden="true" className="relative block">
        <span className="invisible">{message}</span>
        <span className="absolute inset-0">
          {message.slice(0, visibleLength)}
          <span className="auth-typewriter-cursor ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 bg-current motion-reduce:hidden" />
        </span>
      </span>
    </p>
  );
}
