import { TextGenerateEffect } from "./ui/text-generate-effect";

const words = `I create compelling visuals that bring your ideas to life, designed to inspire, engage, and tell authentic stories.
`;

const About = () => {
  return (
    <section
      id="about-section"
      className="relative overflow-x-hidden min-h-[600px] h-[70vh]  md:h-[80vh] lg:h-fit lg:min-h-screen"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black from-[6%] via-black/70 via-40% to-background"></div>

      <div className="z-10 absolute top-[53%] left-2/4 -translate-x-1/2 -translate-y-1/2 w-[90%] 2xl:w-[80%]">
        <TextGenerateEffect words={words} viewportAmount={0.5} duration={1} />
      </div>

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
    </section>
  );
};
export default About;
