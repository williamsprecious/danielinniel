import { Metadata } from "next";
import AboutPage from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About",
};

const About = () => {
  return <AboutPage />;
};

export default About;
