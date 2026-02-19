import z from "zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import ReasonSelectionTab from "@/components/ReasonSelectionTab";
import ProjectForm from "@/components/ProjectForm";
import ContactForm from "@/components/ContactForm";
import ProjectConfirmationForm from "@/components/ProjectConfirmationForm";
import { projectSchema } from "@/schema";
import { useNewBooking } from "@/hooks/use-new-booking";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getBudgetList } from "@/constants";
import { sendProjectEmail } from "@/actions/contact.action";

const stepVariants = {
  initial: {
    opacity: 0,
    x: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.95,
  },
};

const stepTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1] as const,
};

const AnimatedStepWrapper = ({
  children,
  stepKey,
}: {
  children: React.ReactNode;
  stepKey: string;
}) => (
  <motion.div
    key={stepKey}
    variants={stepVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={stepTransition}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const BookingForm = () => {
  const { reason, step, category, grade, setStep, design } = useNewBooking();
  const budgetList = getBudgetList(category, grade, design);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    trigger,
    watch,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      budget: budgetList[0],
      projectDetails: "",
      category: category,
      grade: grade,
      design: design,
      name: "",
      company: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof projectSchema>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const submissionData = { ...data };

      // Remove the grade field if the category is not cover-art
      if (data.category !== "cover-art") {
        delete submissionData.grade;
      }

      if (!submissionData.company) {
        delete submissionData.company;
      }

      // Send email using server action
      const result = await sendProjectEmail(submissionData);

      if (result.success) {
        setStep(4);
      } else {
        // Handle validation errors from server
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            setError(field as keyof z.infer<typeof projectSchema>, {
              type: "server",
              message: messages[0],
            });
          });
        } else {
          setSubmitError(result.message);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError("Failed to send your request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <AnimatedStepWrapper stepKey="step-1">
            <ReasonSelectionTab />
          </AnimatedStepWrapper>
        );

      case 2:
        return reason === "project" ? (
          <AnimatedStepWrapper stepKey="step-2-project">
            <ProjectForm
              disabled={false}
              errors={errors}
              register={register}
              control={control}
              trigger={trigger}
              setValue={setValue}
              watch={watch}
            />
          </AnimatedStepWrapper>
        ) : (
          <AnimatedStepWrapper stepKey="step-2-contact">
            <ContactForm />
          </AnimatedStepWrapper>
        );

      case 3:
        return (
          <AnimatedStepWrapper stepKey="step-3">
            {submitError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                {submitError}
              </div>
            )}
            <ProjectConfirmationForm
              register={register}
              errors={errors}
              disabled={isSubmitting}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
            />
          </AnimatedStepWrapper>
        );

      case 4:
        return (
          <div className="h-screen px-5 flex items-center justify-center md:px-0 md:h-fit">
            <p className="text-muted-foreground tracking-wide border border-border border-solid p-4 rounded-md text-center">
              Thank you for submitting your interest in working with{" "}
              <span className="text-primary/80 font-semibold">
                Danielinniel
              </span>
              . You&apos;ll be gotten back to you shortly!
            </p>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <ScrollArea className="h-full w-full">
      <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
    </ScrollArea>
  );
};

export default BookingForm;
