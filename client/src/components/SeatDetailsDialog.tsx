import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, CircleCheckBig, CircleX, Search, Filter } from "lucide-react";
import type { CategorySeats } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface SeatDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  stationType: string;
}

type FilterStatus = "all" | "available" | "occupied";

export function SeatDetailsDialog({
  open,
  onOpenChange,
  category,
  stationType,
}: SeatDetailsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

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

  const filteredSeats = useMemo(() => {
    if (!seatData?.seats) return [];

    return seatData.seats.filter((seat) => {
      const matchesSearch = seat.seatName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterStatus === "all" ||
        seat.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [seatData?.seats, searchQuery, filterStatus]);

  const handleReset = () => {
    setSearchQuery("");
    setFilterStatus("all");
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

        {/* Search and Filter Controls */}
        {!isLoading && !error && seatData && (
          <div className="space-y-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by seat name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-seats"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" data-testid="icon-filter" />
              <div className="flex gap-2 flex-1">
                <Button
                  size="sm"
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className="flex-1"
                  data-testid="button-filter-all"
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "available" ? "default" : "outline"}
                  onClick={() => setFilterStatus("available")}
                  className={`flex-1 ${
                    filterStatus === "available" 
                      ? "bg-success hover:bg-success/90" 
                      : ""
                  }`}
                  data-testid="button-filter-available"
                >
                  Available
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === "occupied" ? "default" : "outline"}
                  onClick={() => setFilterStatus("occupied")}
                  className={`flex-1 ${
                    filterStatus === "occupied" 
                      ? "bg-destructive hover:bg-destructive/90" 
                      : ""
                  }`}
                  data-testid="button-filter-occupied"
                >
                  Occupied
                </Button>
              </div>
            </div>

            {/* Results Count & Reset */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground" data-testid="text-results-count">
                Showing {filteredSeats.length} of {seatData.seats.length} seats
              </span>
              {(searchQuery || filterStatus !== "all") && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  data-testid="button-reset-filters"
                  className="h-auto py-1 px-2 text-xs"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        )}

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

          {/* No Results Message */}
          {!isLoading && !error && seatData && filteredSeats.length === 0 && (
            <div className="text-center py-8" data-testid="text-no-results">
              <p className="text-muted-foreground mb-2">No seats found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter
              </p>
            </div>
          )}

          {!isLoading && !error && seatData && filteredSeats.map((seat) => (
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
