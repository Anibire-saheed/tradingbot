"use client";

import { useEffect, useState } from "react";

const words = ["Faster", "Simpler", "Safer"];

export function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span
      key={words[index]}
      className="inline-block animate-in fade-in slide-in-from-bottom-2 text-blue-600 duration-300"
    >
      {words[index]}
    </span>
  );
}
