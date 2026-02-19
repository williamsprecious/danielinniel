"use client";

import ScrollToSectionButton from "@/components/ScrollToSectionButton";

const HomeIntroVideo = () => {
  return (
    <section
      id="home-intro"
      className="relative bg-black min-h-80 md:min-h-screen"
    >
      <video
        className="size-full object-cover max-lg:h-[75vw]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="https://res.cloudinary.com/douya9xj8/video/upload/v1763308369/xzark78p8rqajdfjebcl.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <ScrollToSectionButton targetId="works" />
    </section>
  );
};

export default HomeIntroVideo;
