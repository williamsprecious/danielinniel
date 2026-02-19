declare interface GalleryFilterValuesProps {
  title: string;
  value: string;
}

declare interface GalleryProps {
  title: string;
  filterValues: GalleryFilterValuesProps[];
  linkParams: string;
  category: "concept-and-design" | "cover-art";
  grade?: "essential" | "advanced" | null;
  type: "grade" | "conceptType";
}

declare interface GalleryFilterProps {
  title: string;
  filterValues: GalleryFilterValuesProps[];
  linkParams: string;
  type: "grade" | "conceptType";
}

declare interface GalleryFilterItemProps {
  filterValue: GalleryFilterValuesProps;
  linkParams: string;
  type: "grade" | "conceptType";
}

declare interface StartProjectButtonProps {
  category: "concept-and-design" | "cover-art";
  grade?: "essential" | "advanced" | null;
}

declare interface ScrollToSectionButtonProps {
  targetId: string;
  className?: string;
}

declare interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
