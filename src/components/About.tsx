"use client";

import { useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const text = `I create compelling visuals that bring your ideas to life, designed to inspire, engage, and tell authentic stories.`;
  const words = useMemo(() => text.split(" "), [text]);

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !videoContainerRef.current ||
        !textRef.current
      )
        return;

      const container = containerRef.current;
      const videoContainer = videoContainerRef.current;
      const textContainer = textRef.current;

      gsap.set(textContainer, { yPercent: 0 });

      // Phase 1: Video Growth as the container enters the viewport
      gsap.to(videoContainer, {
        width: "100%",
        height: "99%",
        borderRadius: "0px",
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "top top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Phase 2: Pinning, Text Reveal and Progressive Character Fade
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.5}`,
          scrub: true,
          pin: container,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Move text up
      tl.to(
        textContainer,
        {
          yPercent: -100,
          ease: "none",
          duration: 1,
        },
        0, // Start at timeline beginning
      );

      // 2. Progressive Character Fade
      const chars = gsap.utils.toArray<HTMLElement>(".char", textContainer);
      if (chars.length > 0) {
        tl.to(
          chars,
          {
            opacity: 1,
            stagger: 0.1,
            ease: "power1.inOut",
            duration: 0.8,
          },
          0.1, // Starts slightly after the text begins moving up
        );
      }
    },
    { scope: containerRef, dependencies: [] },
  );

  return (
    <div className="relative w-full max-w-full overflow-x-clip">
      <section
        id="about-section"
        ref={containerRef}
        className="relative isolate z-20 h-screen w-full max-w-full overflow-hidden bg-background"
      >
        <div
          ref={videoContainerRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] overflow-hidden rounded-[2rem]"
        >
          <video
            className="size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source
              src="https://res.cloudinary.com/douya9xj8/video/upload/v1771467755/s8xdeo1ibje4hhol1dqs.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Static gradient overlay correctly positioned over the entire section. 
            Using -inset-1 fixes any browser sub-pixel rendering gaps on borders. */}
        <div className="absolute -inset-1 bg-gradient-to-b from-black from-[6%] via-black/60 via-40% to-background pointer-events-none"></div>

        <div
          ref={textRef}
          className="absolute top-full left-0 w-full h-full flex flex-col items-center justify-center p-8 z-10"
        >
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center leading-[1.3] md:leading-[1.15] text-foreground/90 mix-blend-difference w-[95%] md:w-[85%] lg:w-[80%] xl:w-[70%] 2xl:text-6xl">
            {words.map((word, wordIndex) => (
              <span key={`word-${wordIndex}`} className="inline-block">
                {word.split("").map((char, charIndex) => (
                  <span
                    key={`char-${wordIndex}-${charIndex}`}
                    className="char inline-block"
                    style={{ opacity: 0.1 }}
                  >
                    {char}
                  </span>
                ))}
                <span className="inline-block whitespace-pre"> </span>
              </span>
            ))}
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
