import { Metadata } from "next";
import CoverArtPage from "@/components/pages/CoverArtPage";

export const metadata: Metadata = {
  title: "Cover Arts",
  description:
    "My Cover Art grades ranges from Essential for standard artworks to Advanced for more detailed and polished artworks.",
};

const CoverArt = () => {
  return <CoverArtPage />;
};

export default CoverArt;
