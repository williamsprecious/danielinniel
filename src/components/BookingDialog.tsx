"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Modal, ModalBody, ModalContent } from "./ui/animated-modal";
import { useNewBooking } from "@/hooks/use-new-booking";
import BookingForm from "./BookingForm";

const BookingDialog = () => {
  const { isOpen, toggleOpen } = useNewBooking();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(value) => toggleOpen(value)}>
        <SheetContent>
          <VisuallyHidden>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
          </VisuallyHidden>
          <BookingForm />
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Modal open={isOpen} setOpen={(value) => toggleOpen(value)}>
      <ModalBody>
        <ModalContent>
          <BookingForm />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
};

export default BookingDialog;
