import z from "zod";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNewBooking } from "@/hooks/use-new-booking";
import { projectSchema } from "@/schema";
import { cn } from "@/lib/utils";
import ButtonAnimationWrapper from "@/components/ButtonAnimationWrapper";

const ProjectConfirmationForm = ({
  register,
  disabled,
  errors,
  handleSubmit,
  onSubmit,
}: {
  register: UseFormRegister<z.infer<typeof projectSchema>>;
  errors: FieldErrors<z.infer<typeof projectSchema>>;
  disabled: boolean;
  handleSubmit: UseFormHandleSubmit<z.infer<typeof projectSchema>>;
  onSubmit: (values: z.infer<typeof projectSchema>) => void;
}) => {
  const { setStep } = useNewBooking();

  const handleTrimmedSubmit = handleSubmit((values) => {
    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company?.trim() ?? "",
      projectDetails: values.projectDetails.trim(),
    };

    onSubmit(trimmedValues);
  });

  return (
    <div className="grid gap-8 relative max-[400px]:px-4! max-md:py-40 max-md:px-6 md:gap-4">
      <p className="uppercase text-sm text-muted-foreground">
        (Contact Details)
      </p>

      <Input
        className={cn(errors.name?.message && "border border-destructive/90")}
        placeholder="Your Name"
        disabled={disabled}
        {...register("name")}
      />

      <Input
        className={cn(
          errors.company?.message && "border border-destructive/90"
        )}
        placeholder="Company (optional)"
        disabled={disabled}
        {...register("company")}
      />

      <Input
        type="email"
        className={cn(errors.email?.message && "border border-destructive/90")}
        placeholder="Email"
        disabled={disabled}
        {...register("email")}
      />

      <div className="flex justify-end gap-2 px-2 pb-2">
        <Button
          variant="ghost"
          size="lg"
          className="justify-self-end mt-4 text-muted-foreground"
          disabled={disabled}
          onClick={() => setStep(2)}
        >
          Previous
        </Button>

        <ButtonAnimationWrapper>
          <Button
            variant="secondary"
            size="lg"
            className="justify-self-end mt-4"
            onClick={handleTrimmedSubmit}
            disabled={disabled}
          >
            {disabled ? "Submitting..." : "Submit"}
          </Button>
        </ButtonAnimationWrapper>
      </div>
    </div>
  );
};

export default ProjectConfirmationForm;
