import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, CircleCheckBig, CircleX } from "lucide-react";
import type { CategorySeats } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface SeatDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  stationType: string;
}

export function SeatDetailsDialog({
  open,
  onOpenChange,
  category,
  stationType,
}: SeatDetailsDialogProps) {
  const { data: seatData, isLoading, error } = useQuery<CategorySeats>({
    queryKey: ["/api/seats", category],
    enabled: open,
  });

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeRemaining = (endTime: string) => {
    try {
      return formatDistanceToNow(new Date(endTime), { addSuffix: true });
    } catch {
      return "N/A";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto" data-testid="dialog-seat-details">
        <DialogHeader>
          <DialogTitle data-testid="text-dialog-title">
            {stationType} Live Availability
          </DialogTitle>
          <DialogDescription data-testid="text-dialog-description">
            {seatData && (
              <span>
                {seatData.availableCount} of {seatData.totalSeats} seats available
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-loading">
              Loading seat details...
            </div>
          )}

          {error && (
            <div className="text-center py-8" data-testid="text-error">
              <p className="text-destructive mb-2">Failed to load seat details</p>
              <p className="text-sm text-muted-foreground">
                {(error as any)?.message || "Please try again later"}
              </p>
            </div>
          )}

          {!isLoading && !error && seatData && seatData.seats.map((seat) => (
            <div
              key={seat.seatName}
              className={`p-4 rounded-lg border transition-colors ${
                seat.status === "available"
                  ? "bg-success/10 border-success/30"
                  : "bg-destructive/10 border-destructive/30"
              }`}
              data-testid={`seat-${seat.seatName.toLowerCase()}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {seat.status === "available" ? (
                    <CircleCheckBig className="h-5 w-5 text-success" data-testid={`icon-available-${seat.seatName}`} />
                  ) : (
                    <CircleX className="h-5 w-5 text-destructive" data-testid={`icon-occupied-${seat.seatName}`} />
                  )}
                  <span className="font-semibold text-foreground" data-testid={`text-seat-name-${seat.seatName}`}>
                    {seat.seatName}
                  </span>
                </div>
                <Badge
                  variant={seat.status === "available" ? "default" : "destructive"}
                  className={seat.status === "available" ? "bg-success hover:bg-success/90" : ""}
                  data-testid={`badge-status-${seat.seatName}`}
                >
                  {seat.status === "available" ? "Available" : "Occupied"}
                </Badge>
              </div>

              {seat.status === "occupied" && seat.startTime && (
                <div className="text-sm text-muted-foreground space-y-1 ml-7">
                  <div className="flex items-center gap-2" data-testid={`text-start-time-${seat.seatName}`}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>Started: {formatTime(seat.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2" data-testid={`text-end-time-${seat.seatName}`}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>Ends: {seat.endTime ? formatTime(seat.endTime) : "TBD"}</span>
                  </div>
                  {seat.endTime && (
                    <div className="text-xs text-muted-foreground/80" data-testid={`text-time-remaining-${seat.seatName}`}>
                      Will be free {getTimeRemaining(seat.endTime)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
