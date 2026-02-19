import { create } from "zustand";

type NewBokingState = {
  isOpen: boolean;
  step: number;
  reason: "project" | "partnership";
  category: "concept-and-design" | "cover-art";
  grade: "essential" | "advanced";
  design:
    | "concept-art"
    | "character-design"
    | "logo"
    | "fashion-illustration"
    | "others";
  toggleOpen: (value: boolean) => void;
  setStep: (value: number) => void;
  setReason: (value: "project" | "partnership") => void;
  setCategory: (value: "concept-and-design" | "cover-art") => void;
  setGrade: (value: "essential" | "advanced") => void;
  setDesign: (
    value:
      | "concept-art"
      | "character-design"
      | "logo"
      | "fashion-illustration"
      | "others"
  ) => void;
};

export const useNewBooking = create<NewBokingState>((set) => ({
  isOpen: false,
  step: 1,
  reason: "project",
  category: "concept-and-design",
  grade: "essential",
  design: "concept-art",
  toggleOpen: (value) => set({ isOpen: value }),
  setStep: (value) => set({ step: value }),
  setReason: (value: "project" | "partnership") => set({ reason: value }),
  setCategory: (value: "concept-and-design" | "cover-art") =>
    set({ category: value }),
  setGrade: (value: "essential" | "advanced") => set({ grade: value }),
  setDesign: (
    value:
      | "concept-art"
      | "character-design"
      | "logo"
      | "fashion-illustration"
      | "others"
  ) => set({ design: value }),
}));
