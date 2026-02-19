import { Metadata } from "next";
import WorksPage from "@/components/pages/WorksPage";

export const metadata: Metadata = {
  title: "My Works",
  description:
    "A curated mix of art, ideas, and visuals that represent my creative journey.",
};

const Works = () => {
  return <WorksPage />;
};

export default Works;
