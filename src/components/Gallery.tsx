import GalleryFilter from "@/components/GalleryFilter";
import GalleryGrid from "@/components/GalleryGrid";
import StartProjectButton from "@/components/StartProjectButton";

const Gallery = ({
  title,
  filterValues,
  linkParams,
  category,
  grade,
  type,
}: GalleryProps) => {
  return (
    <section className="relative pt-20 pb-20 md:pt-40 md:pb-24 2xl:pt-48">
      <GalleryFilter
        title={title}
        filterValues={filterValues}
        linkParams={linkParams}
        type={type}
      />

      <GalleryGrid category={category} />

      <StartProjectButton category={category} grade={grade || null} />
    </section>
  );
};

export default Gallery;

// className="relative pt-20 pb-20 md:pt-44 md:pb-24 space-y-16 md:space-y-16 2xl:pt-48 2xl:space-y-20"
