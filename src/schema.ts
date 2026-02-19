import { z } from "zod";

export const projectSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    category: z.enum(["concept-and-design", "cover-art"]),
    grade: z.enum(["essential", "advanced"]).optional(),
    design: z
      .enum([
        "concept-art",
        "character-design",
        "logo",
        "fashion-illustration",
        "others",
      ])
      .optional(),
    budget: z.string().min(1, "Please select a budget range"),
    projectDetails: z
      .string()
      .min(6, "Project details must be at least 6 characters long"),
    company: z.string().optional(),
  })
  .refine(
    (data) => {
      // If category is cover-art, grade must be provided
      if (data.category === "cover-art") {
        return data.grade !== undefined;
      }
      if (data.category === "concept-and-design") {
        return data.design !== undefined;
      }
      return true;
    },
    {
      message: "Grade is required when category is Cover Art",
      path: ["grade"], // This will show the error on the grade field
    }
  );

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(5),
});
