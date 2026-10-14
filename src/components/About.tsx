"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ABOUT_TEXT =
  "I create compelling visuals that bring your ideas to life, designed to inspire, engage, and tell authentic stories.";
const WORDS = ABOUT_TEXT.split(" ");

const About = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !trackRef.current ||
        !containerRef.current ||
        !videoContainerRef.current ||
        !textRef.current
      )
        return;

      const track = trackRef.current;
      const container = containerRef.current;
      const videoContainer = videoContainerRef.current;
      const textContainer = textRef.current;

      const wordElements = gsap.utils.toArray<HTMLElement>(
        ".word",
        textContainer,
      );
      const chars = gsap.utils.toArray<HTMLElement>(".char", textContainer);
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // GSAP owns the entire offset; a CSS translate would survive yPercent: 0.
        // Set the base state too so staggered words stay masked on reverse/refresh.
        gsap.set(wordElements, { y: 0, yPercent: 110 });

        // Scale the video instead of resizing its layout on every scroll frame.
        // Explicit starting values keep refreshes from rebasing the animations.
        gsap.fromTo(
          videoContainer,
          { scale: 0.85, borderRadius: "2rem" },
          {
            scale: 1,
            borderRadius: "0px",
            ease: "none",
            scrollTrigger: {
              trigger: track,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        // CSS holds the section in place. Measure that same sticky range so
        // toolbar changes cannot make the text finish after the section releases.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: () => `+=${track.offsetHeight - container.offsetHeight}`,
            scrub: true,
            // Only the scroll distance changes on resize; tween endpoints are fixed.
            // Keep their original start states when ScrollTrigger remeasures.
            invalidateOnRefresh: false,
          },
        });

        // Keep the masked entrance within the first 5% of the scroll range.
        tl.fromTo(
          wordElements,
          { y: 0, yPercent: 110 },
          {
            y: 0,
            yPercent: 0,
            stagger: { amount: 0.01 },
            ease: "power2.out",
            duration: 0.04,
          },
          0,
        );
        // Begin the character reveal after every word has settled into place.
        tl.fromTo(
          chars,
          { opacity: 0.1 },
          {
            opacity: 1,
            stagger: { amount: 0.75 },
            ease: "none",
            duration: 0.1,
          },
          0.05,
        );
        // Leave a short fully readable pause before the sticky section releases.
        tl.to({}, { duration: 0.1 }, 0.9);

        // Only watch layout that can change this section's scroll coordinates.
        // A body observer also reacts to unrelated layout and pin-spacer changes.
        let refreshTimeout: ReturnType<typeof setTimeout> | undefined;
        const observer = new ResizeObserver(() => {
          clearTimeout(refreshTimeout);
          refreshTimeout = setTimeout(() => ScrollTrigger.refresh(true), 150);
        });
        observer.observe(track);
        for (
          let sibling = track.previousElementSibling;
          sibling;
          sibling = sibling.previousElementSibling
        ) {
          observer.observe(sibling);
        }

        return () => {
          clearTimeout(refreshTimeout);
          observer.disconnect();
        };
      });

      return () => media.revert();
    },
    { scope: trackRef },
  );

  return (
    // A stable large viewport fills the screen even when mobile toolbars hide.
    // Keep overflow on the sticky section, not its scroll track.
    <div
      ref={trackRef}
      className="relative h-[250vh] w-full max-w-full supports-[height:100lvh]:h-[250lvh] motion-reduce:h-screen motion-reduce:supports-[height:100svh]:h-[100svh]"
    >
      <section
        id="about-section"
        ref={containerRef}
        className="sticky top-0 isolate z-20 h-screen w-full max-w-full overflow-hidden bg-background supports-[height:100lvh]:h-[100lvh] motion-reduce:relative motion-reduce:supports-[height:100svh]:h-[100svh]"
      >
        <div
          ref={videoContainerRef}
          className="absolute inset-0 origin-center overflow-hidden rounded-[2rem] [transform:scale(0.85)] motion-reduce:rounded-none motion-reduce:[transform:scale(1)]"
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
              src="https://media.willysart.com/assets/s8xdeo1ibje4hhol1dqs.mp4"
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
          className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
        >
          <p className="text-3xl font-heading sm:text-4xl md:text-5xl lg:text-6xl text-center leading-[1.3] md:leading-[1.15] text-foreground/90 md:mix-blend-difference w-[95%] md:w-[85%] lg:w-[80%] xl:w-[70%] 2xl:text-7xl">
            {WORDS.map((word, wordIndex) => (
              <span
                key={`word-${wordIndex}`}
                className="inline-block overflow-hidden align-bottom"
              >
                <span className="word inline-block">
                  {word.split("").map((char, charIndex) => (
                    <span
                      key={`char-${wordIndex}-${charIndex}`}
                      className="char inline-block opacity-10 motion-reduce:opacity-100"
                    >
                      {char}
                    </span>
                  ))}
                  <span className="inline-block whitespace-pre"> </span>
                </span>
              </span>
            ))}
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
