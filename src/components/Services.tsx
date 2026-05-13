"use client";

import ServiceCard from "@/components/ServiceCard";
import ServicesHeading from "./ServicesHeading";
import { useIsMobile } from "@/hooks/use-mobile";
import coverArt from "../../public/cover.webp";
import conceptArt from "../../public/concept.webp";
import shop from "../../public/shop.webp";

const Services = () => {
  const isMobile = useIsMobile();
  return (
    <section className="row-container py-20 space-y-12 md:py-24 lg:to-60% 2xl:py-32 2xl:to-50% md:space-y-16 lg:space-y-20 2xl:space-y-24">
      <ServicesHeading />

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-5 md:gap-7 lg:gap-10 lg:grid-cols-3 lg-xl:gap-16 2xl:gap-20">
        <ServiceCard
          text="Cover Art"
          href="/cover-art"
          viewDelay={isMobile ? 0.6 : 0.4}
          src="https://d1o0lg255tq9i5.cloudfront.net/cover-motion-compressed.gif"
          fallbackSrc={coverArt}
        />
        <ServiceCard
          highlighted
          text="Concept & Design"
          href="/design/concept-art"
          viewDelay={isMobile ? 0.3 : 0.2}
          src="https://d1o0lg255tq9i5.cloudfront.net/concept-motion-compressed.gif"
          fallbackSrc={conceptArt}
        />
        <ServiceCard
          text="Shop"
          href="/shop"
          viewDelay={isMobile ? 0.2 : 0.5}
          src="https://d1o0lg255tq9i5.cloudfront.net/shop-motion-compressed.gif"
          fallbackSrc={shop}
        />
      </div>
    </section>
  );
};

export default Services;
