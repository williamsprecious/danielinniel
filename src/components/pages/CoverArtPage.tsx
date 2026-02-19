"use client";

import { motion } from "motion/react";
import { useIsMobile } from "@/hooks/use-mobile";
import HeaderText from "@/components/HeaderText";
import essential from "../../../public/essential.webp";
import advanced from "../../../public/advanced.webp";
import CoverCard from "@/components/CoverCard";

const CoverArtPage = () => {
  const isMobile = useIsMobile();

  return (
    <section className="row-container pt-20 pb-36 space-y-12 md:space-y-16 md:pt-44 md:pb-40 lg:space-y-20 2xl:pt-52 2xl:space-y-24 2xl:pb-48">
      <div className="max-w-2xl mx-auto space-y-6 min-[580px]:px-7 md:px-3 lg:px-0 2xl:max-w-3xl 2xl:space-y-7">
        <HeaderText title="Choose Your Grade!" underline />
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
          className="text-center text-base max-sm:leading-[1.4] font-light sm:text-lg md:text-xl"
        >
          Cover Art grades ranges from{" "}
          <span className="text-transparent font-semibold bg-clip-text bg-radial from-[#a5d4d0] via-[#7cbcc3] to-[#6cb0bb]">
            Essential
          </span>{" "}
          for standard artworks to{" "}
          <span className="text-transparent font-semibold bg-clip-text bg-radial from-[#a5d4d0] via-[#7cbcc3] to-[#6cb0bb]">
            Advanced
          </span>{" "}
          for more detailed and polished artworks.
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-10 grid-cols-1 justify-items-center md:grid-cols-2 md:gap-7 lg:gap-12 2xl:max-w-6xl">
        <CoverCard
          text="Essential"
          priceTag="500+"
          href="/cover-art/essential"
          viewDelay={isMobile ? 0.5 : 0.2}
          src={essential}
          features={[
            "Custom illustration",
            "2 drafts",
            "1 revision",
            "Streaming-optimized export",
            "Simplified graphics motion (15–30 sec)",
          ]}
        />
        <CoverCard
          text="Advanced"
          priceTag="1000+"
          href="/cover-art/advanced"
          viewDelay={isMobile ? 0.3 : 0.4}
          src={advanced}
          features={[
            "Custom highly detailed illustration",
            "2 drafts",
            "2 revisions",
            "Streaming-optimized exports",
            "Defined motion video (30–45 sec)",
            "Social media banner",
            "Commercial usage license",
          ]}
        />
      </div>
    </section>
  );
};

export default CoverArtPage;
