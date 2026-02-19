import { Metadata } from "next";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import { expectedGradeParams } from "@/constants";
import { checkValidParams } from "@/lib/utils";

interface Props {
  params: Promise<{ grade: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grade } = await params;

  const formattedGrade = grade
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return {
    title: {
      absolute: `${formattedGrade} - Cover Arts`,
    },
  };
}

const GradePage = async ({ params }: Props) => {
  const { grade } = await params;

  const isValidParams = checkValidParams({
    params: grade,
    expectedParams: expectedGradeParams,
  });

  if (!isValidParams) {
    return notFound();
  }

  return (
    <Gallery
      title="Cover Arts"
      filterValues={expectedGradeParams}
      linkParams="cover-art"
      category="cover-art"
      grade={grade as "essential" | "advanced" | null}
      type="grade"
    />
  );
};

export default GradePage;
