"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Licensed financial services",
    description:
      "Grow your savings with a state-of-the-art AI-based trading system",
    image: "/connect.svg",
    imageAlt: "Connect wallet app screen",
    imageWidth: 426,
    imageHeight: 586,
  },
  {
    title: "Automated portfolio tools",
    description:
      "Track positions, trigger entries, and manage risk from one clean dashboard",
    image: "/create.svg",
    imageAlt: "Create trading plan app screen",
    imageWidth: 577,
    imageHeight: 433,
  },
  {
    title: "Instant trading insights",
    description:
      "See real-time market movement, AI signals, and withdrawal status without delays",
    image: "/trade.svg",
    imageAlt: "Trader reviewing market analytics",
    imageWidth: 1448,
    imageHeight: 1086,
  },
];

type Slide = (typeof slides)[number];

function ServiceImage({ slide }: { slide: Slide }) {
  return (
    <div className="relative grid min-h-[550px] place-items-center">
      <div className="absolute h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
      <Image
        key={slide.image}
        src={slide.image}
        alt={slide.imageAlt}
        width={slide.imageWidth}
        height={slide.imageHeight}
        className="relative z-10 max-h-[520px] w-auto max-w-full animate-in fade-in zoom-in-95 duration-300"
      />
    </div>
  );
}

export function LicensedServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  function showPreviousSlide() {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1,
    );
  }

  function showNextSlide() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  return (
    <section className="overflow-hidden bg-white px-6 pb-8 pt-0 text-slate-950 md:px-14 lg:px-28">
      <div className="mx-auto grid max-w-7xl items-center gap-0 md:gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <ServiceImage slide={activeSlide} />

        <div>
          <h2 className="font-heading text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
            {activeSlide.title}
          </h2>
          <p className="mt-8 max-w-xl text-2xl leading-9 text-slate-600">
            {activeSlide.description}
          </p>
          <div className="mt-14 flex gap-5">
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="Previous service"
              onClick={showPreviousSlide}
              className="size-16 rounded-xl border-slate-300 bg-white text-slate-600"
            >
              <ArrowLeft className="size-7" />
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="Next service"
              onClick={showNextSlide}
              className="size-16 rounded-xl border-slate-300 bg-white text-slate-600"
            >
              <ArrowRight className="size-7" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
