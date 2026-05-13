import z from "zod";
import { useEffect } from "react";
import {
  FieldErrors,
  UseFormRegister,
  Control,
  Controller,
  UseFormTrigger,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Tabs, TabsList, TabsTrigger } from "./ui/bookings-tab";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projectSchema } from "@/schema";
import { useNewBooking } from "@/hooks/use-new-booking";
import { cn } from "@/lib/utils";
import { getBudgetList } from "@/constants";
import ButtonAnimationWrapper from "@/components/ButtonAnimationWrapper";
import { CircleAlert } from "lucide-react";

const ProjectForm = ({
  register,
  control,
  disabled,
  errors,
  trigger,
  setValue,
  watch,
}: {
  register: UseFormRegister<z.infer<typeof projectSchema>>;
  control: Control<z.infer<typeof projectSchema>>;
  disabled: boolean;
  errors: FieldErrors<z.infer<typeof projectSchema>>;
  trigger: UseFormTrigger<z.infer<typeof projectSchema>>;
  setValue: UseFormSetValue<z.infer<typeof projectSchema>>;
  watch: UseFormWatch<z.infer<typeof projectSchema>>;
}) => {
  const { category, setStep, setCategory, grade, setGrade, setDesign, design } =
    useNewBooking();
  const budgetList = getBudgetList(category, grade, design);
  const currentBudget = watch("budget");

  // Set budget to first available option if current budget is not in the new budget list
  useEffect(() => {
    if (
      budgetList.length > 0 &&
      (!currentBudget || !budgetList.includes(currentBudget))
    ) {
      setValue("budget", budgetList[0], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [category, grade, currentBudget, budgetList, setValue]);

  const handleContinue = async () => {
    const currentDetails = watch("projectDetails");
    if (typeof currentDetails === "string") {
      const trimmedDetails = currentDetails.trim();
      if (trimmedDetails !== currentDetails) {
        setValue("projectDetails", trimmedDetails, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }

    // Validate the project form fields
    const validationPromises = [
      trigger("category"),
      trigger("budget"),
      trigger("projectDetails"),
    ];

    // Add grade validation only if category is cover-art
    if (category === "cover-art") {
      validationPromises.push(trigger("grade"));
    }

    const validationResults = await Promise.all(validationPromises);
    const isAllValid = validationResults.every((result) => result);

    if (isAllValid) {
      setStep(3);
    }
  };

  return (
    <div className="grid gap-8 relative max-[400px]:px-4! max-md:py-40 max-md:px-6 md:gap-4">
      <p className="uppercase text-sm text-muted-foreground">
        (Project Details)
      </p>

      <Tabs defaultValue={category}>
        <TabsList>
          <TabsTrigger
            value="concept-and-design"
            onClick={() => {
              setCategory("concept-and-design");
              setValue("category", "concept-and-design", {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          >
            Concept & Design
          </TabsTrigger>
          <TabsTrigger
            value="cover-art"
            onClick={() => {
              setCategory("cover-art");
              setValue("category", "cover-art", {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          >
            Cover Art
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {category === "cover-art" && (
        <div className="group relative">
          <label className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50">
            Grade
          </label>
          <Controller
            name="grade"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={(value) => {
                  const gradeValue = value as "essential" | "advanced";
                  field.onChange(gradeValue);
                  setGrade(gradeValue);
                }}
                disabled={disabled}
              >
                <SelectTrigger
                  className={cn(
                    "input",
                    errors.grade?.message && "border border-destructive/90",
                  )}
                >
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border text-foreground/60">
                  <SelectItem value="essential">Essential</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      {category === "concept-and-design" && (
        <div className="group relative">
          <label className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50">
            Design Type
          </label>
          <Controller
            name="design"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={(value) => {
                  const conceptValue = value as
                    | "concept-art"
                    | "character-design"
                    | "logo"
                    | "fashion-illustration"
                    | "others";
                  field.onChange(conceptValue);
                  setDesign(conceptValue);
                }}
                disabled={disabled}
              >
                <SelectTrigger
                  className={cn(
                    "input",
                    errors.grade?.message && "border border-destructive/90",
                  )}
                >
                  <SelectValue placeholder="Select design" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border text-foreground/60">
                  <SelectItem value="concept-art">Concept Art</SelectItem>
                  <SelectItem value="character-design">
                    Character Design
                  </SelectItem>
                  <SelectItem value="logo">Logo</SelectItem>
                  <SelectItem value="fashion-illustration">
                    Fashion Illustration
                  </SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <div className="group relative">
        <label className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-60">
          Min Budget
        </label>
        <Controller
          name="budget"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                className={cn(
                  "input",
                  errors.budget?.message && "border border-destructive/90",
                )}
                disabled={budgetList.length === 1}
              >
                <SelectValue placeholder="Select budget" />
              </SelectTrigger>
              <SelectContent className="bg-black/20 backdrop-blur-2xl border-border text-foreground/60">
                {budgetList.map((budget) => (
                  <SelectItem key={budget} value={budget}>
                    {budget}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Textarea
          className={cn(
            errors.projectDetails?.message && "border border-destructive/90",
          )}
          placeholder="Describe your idea in detail"
          rows={10}
          {...register("projectDetails")}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4 px-2 pb-2">
        <Button
          variant="ghost"
          size="lg"
          className="justify-self-end text-muted-foreground"
          onClick={() => setStep(1)}
        >
          Previous
        </Button>

        <ButtonAnimationWrapper>
          <Button
            variant="secondary"
            size="lg"
            className="justify-self-end"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </ButtonAnimationWrapper>
      </div>
    </div>
  );
};

export default ProjectForm;
