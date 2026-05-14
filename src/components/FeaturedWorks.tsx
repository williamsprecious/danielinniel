import { urlFor } from "@/sanity/lib/image";
import { FEATURE_QUERY_RESULT } from "../../sanity.types";
import HeaderText from "@/components/HeaderText";
import Carousel from "@/components/ui/carousel";

const FeaturedWorks = ({ works }: { works: FEATURE_QUERY_RESULT }) => {
  const items = works.map((work) => {
    const workWithUrl = work as FEATURE_QUERY_RESULT[0] & {
      workUrl?: string | null;
    };

    return {
      button: "View Work",
      src: urlFor(work.image!).url(),
      title: work.title!,
      _id: work._id,
      workUrl: workWithUrl.workUrl || null,
      image: work.image || null,
    };
  });

  return (
    <section
      id="works"
      className="pt-20 pb-36 space-y-16 overflow-x-hidden bg-radial from-[#18202E] from-0% via-20% via-[#18202E]/65 to-black to-95% md:via-[#18202E]/65 md:py-28 lg:to-65% 2xl:via-[#18202E]/65 2xl:via-20% 2xl:to-85% 2xl:space-y-24 2xl:py-36"
    >
      <HeaderText title="Featured Works" />

      <div>
        {items.length ? (
          <Carousel slides={items} />
        ) : (
          <div className="row-container h-full flex items-center justify-center">
            <p className="text-lg italic opacity-85 text-center font-light tracking-wide md:text-xl">
              No value to show at the moment. Check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedWorks;
