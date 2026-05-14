import HomeIntroVideo from "@/components/HomeIntroVideo";
import About from "@/components/About";
import FeaturedWorks from "@/components/FeaturedWorks";
import Services from "@/components/Services";
import Nft from "@/components/Nft";
import { getFeaturedWorks } from "@/sanity/queries";

const Home = async () => {
  const featuredWorks = await getFeaturedWorks();

  return (
    <>
      <HomeIntroVideo />
      <FeaturedWorks works={featuredWorks} />
      <About />
      <Services />
      <Nft />
    </>
  );
};

export default Home;
