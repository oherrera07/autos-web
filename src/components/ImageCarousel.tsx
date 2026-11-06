"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function ImageCarousel({
  images,
  alt,
  sizes = "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}: {
  images: string[];
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {

  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const next = Math.max(0, Math.min(images.length - 1, i));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-gray-100 text-sm text-gray-400">
        Sin fotos
      </div>
    );
  }

  const many = images.length > 1;

  return (
    <div className="group relative bg-black">
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="relative aspect-[4/3] w-full flex-none snap-center"
          >
            <Image
              src={src}
              alt={`${alt} - foto ${i + 1} de ${images.length}`}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {many && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-gray-800 shadow transition hover:bg-white disabled:hidden sm:flex sm:opacity-0 sm:group-hover:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={() => goTo(index + 1)}
            disabled={index === images.length - 1}
            className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-gray-800 shadow transition hover:bg-white disabled:hidden sm:flex sm:opacity-0 sm:group-hover:opacity-100"
          >
            ›
          </button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === index ? "bg-[#16225a]" : "bg-gray-400/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}