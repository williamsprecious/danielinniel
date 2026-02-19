import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkValidParams = ({
  params,
  expectedParams,
}: {
  params: string;
  expectedParams: { title: string; value: string }[];
}) => {
  if (expectedParams.map((param) => param.value).includes(params)) {
    return true;
  } else {
    return false;
  }
};

/**
 * Shared email/template helpers
 */
export const formatCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    "concept-and-design": "Concept & Design",
    "cover-art": "Cover Art",
  };
  return categoryMap[category] || category;
};

export const formatGrade = (grade?: string): string => {
  const gradeMap: Record<string, string> = {
    essential: "Essential",
    advanced: "Advanced",
  };
  return grade ? gradeMap[grade] || grade : "N/A";
};

export const formatDesign = (design?: string): string => {
  const designMap: Record<string, string> = {
    "concept-art": "Concept Art",
    "character-design": "Character Design",
    logo: "Logo",
    "fashion-illustration": "Fashion Illustration",
    others: "Others",
  };
  return design ? designMap[design] || design : "N/A";
};

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}