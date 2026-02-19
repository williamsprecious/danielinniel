import { Metadata } from "next";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import { checkValidParams } from "@/lib/utils";
import { expectedDesignParams } from "@/constants";

interface Props {
  params: Promise<{ conceptType: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { conceptType } = await params;

  const formattedConceptType = conceptType
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return {
    title: {
      absolute: `${formattedConceptType} - Concept & Design`,
    },
  };
}

const DesignPage = async ({ params }: Props) => {
  const { conceptType } = await params;

  const isValidParams = checkValidParams({
    params: conceptType,
    expectedParams: expectedDesignParams,
  });

  if (!isValidParams) {
    return notFound();
  }

  return (
    <Gallery
      title="Concept & Design"
      filterValues={expectedDesignParams}
      linkParams="design"
      category="concept-and-design"
      type="conceptType"
    />
  );
};

export default DesignPage;
