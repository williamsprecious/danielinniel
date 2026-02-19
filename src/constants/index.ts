export const expectedGradeParams = [
  { title: "Essential", value: "essential" },
  { title: "Advanced", value: "advanced" },
];

export const expectedDesignParams = [
  { title: "Concept", value: "concept-art" },
  { title: "Character", value: "character-design" },
  { title: "Logo", value: "logo" },
  { title: "Fashion", value: "fashion-illustration" },
];

export const getBudgetList = (
  category: "concept-and-design" | "cover-art",
  grade: "essential" | "advanced",
  design:
    | "concept-art"
    | "character-design"
    | "logo"
    | "fashion-illustration"
    | "others"
) => {
  switch (category) {
    case "concept-and-design":
      if (design === "concept-art") {
        return ["$1000+"];
      } else if (design === "character-design") {
        return ["$250+"];
      } else if (design === "logo") {
        return ["$500+"];
      } else if (design === "fashion-illustration") {
        return ["$100+"];
      } else {
        return ["$500 - $1000", "$1000 - $1500", "$1500 - $2000", "$2000+"];
      }

    case "cover-art":
      if (grade === "essential") {
        return ["$500+"];
      } else {
        return ["$1000+"];
      }

    default:
      return [];
  }
};

