import { useState, useEffect } from "react";
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
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClose = () => {
    if (countdown === 0) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[420px] rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center px-2">
            🔄 Refresh for Latest Updates
          </DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm px-2">
            For better availability view and real-time updates
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
              <RefreshCw className="h-12 w-12 text-white animate-spin" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Refreshing the page will show you the most up-to-date gaming station availability
            </p>
            <p className="text-xs text-muted-foreground">
              This ensures you see real-time booking information
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleRefresh}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-xl"
              data-testid="button-refresh-page"
            >
              Refresh Now
            </Button>

            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-xs sm:text-sm text-muted-foreground hover:text-foreground"
              disabled={countdown > 0}
              data-testid="button-close-refresh-popup"
            >
              {countdown > 0 ? `Close in ${countdown}s` : "Close"}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground px-2 leading-relaxed">
            💡 Tip: Refresh regularly to see the latest seat availability
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
