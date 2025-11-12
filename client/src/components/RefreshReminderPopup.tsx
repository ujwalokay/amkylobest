import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshReminderPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RefreshReminderPopup({ isOpen, onClose }: RefreshReminderPopupProps) {
  useEffect(() => {
    console.log("[RefreshReminderPopup] isOpen changed:", isOpen);
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[420px] rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center px-2">
            💡 Refresh for Better Seat Availability Check
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm px-2">
            Get the most accurate real-time seat information
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
              <RefreshCw className="h-12 w-12 text-white" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              To see the latest seat availability and make sure you get accurate booking information, please refresh the page regularly.
            </p>
          </div>

          <div>
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-xl"
              data-testid="button-close-refresh-popup"
            >
              Okay, I Got It
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground px-2 leading-relaxed">
            💡 Refresh the page anytime to see updated seat availability
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
