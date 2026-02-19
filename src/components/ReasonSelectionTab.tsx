import { Tabs, TabsList, TabsTrigger } from "@/components/ui/bookings-tab";
import { Button } from "@/components/ui/button";
import { useNewBooking } from "@/hooks/use-new-booking";
import ButtonAnimationWrapper from "@/components/ButtonAnimationWrapper";

const ReasonSelectionTab = () => {
  const { reason, setReason, setStep } = useNewBooking();

  return (
    <div className="grid gap-8 max-[400px]:px-4! max-md:py-40 max-md:px-6 md:gap-4">
      <p className="uppercase text-sm text-muted-foreground">
        (Reason for enquiry)
      </p>

      <Tabs defaultValue={reason}>
        <TabsList>
          <TabsTrigger value="project" onClick={() => setReason("project")}>
            For a Project
          </TabsTrigger>
          <TabsTrigger
            value="partnership"
            onClick={() => setReason("partnership")}
          >
            Partnership
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex justify-end px-2 pb-2 mt-4">
        <ButtonAnimationWrapper>
          <Button
            variant="secondary"
            size="lg"
            className="justify-self-end"
            onClick={() => setStep(2)}
          >
            Continue
          </Button>
        </ButtonAnimationWrapper>
      </div>
    </div>
  );
};

export default ReasonSelectionTab;
