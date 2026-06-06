"use client";

import { motion } from "motion/react";
import HeaderText from "@/components/HeaderText";
import ServiceCard from "@/components/ServiceCard";
import { useIsMobile } from "@/hooks/use-mobile";
import coverArt from "../../../public/cover.webp";
import conceptArt from "../../../public/concept.webp";

const WorksPage = () => {
  const isMobile = useIsMobile();

  return (
    <section className="row-container pt-20 pb-36 space-y-12 md:space-y-16 md:pt-44 md:pb-40 lg:space-y-20 2xl:space-y-24 2xl:pt-52 2xl:pb-48">
      <div className="max-w-2xl mx-auto space-y-6 min-[580px]:px-10 md:px-5 2xl:max-w-3xl 2xl:space-y-7">
        <HeaderText title="My Works" />

        <motion.p
          initial={{
            y: 40,
            opacity: 0,
          }}
          whileInView={{
            y: 0,
            opacity: 0.95,
          }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 18,
            duration: 0.8,
            delay: 0.25,
          }}
          viewport={{ amount: 0.3, once: true }}
          className="text-center text-base opacity-85 font-light sm:text-lg md:text-xl"
        >
          A curated mix of art, ideas, and visuals that represent my creative
          journey.
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-10 grid-cols-1 sm:gap-5 sm:grid-cols-2 md:gap-7 lg:gap-12 2xl:max-w-6xl">
        <ServiceCard
          text="Cover Art"
          href="/cover-art"
          viewDelay={isMobile ? 0.6 : 0.4}
          src="https://d1o0lg255tq9i5.cloudfront.net/cover-motion-compressed.gif"
          fallbackSrc={coverArt}
        />
        <ServiceCard
          text="Concept & Design"
          href="/design/concept-art"
          viewDelay={isMobile ? 0.3 : 0.2}
          src="https://d1o0lg255tq9i5.cloudfront.net/concept-motion-compressed.gif"
          fallbackSrc={conceptArt}
        />
      </div>
    </section>
  );
};

export default WorksPage;
