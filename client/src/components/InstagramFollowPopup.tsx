import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

export function InstagramFollowPopup() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("instagram-follow-popup-seen");
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem("instagram-follow-popup-seen", "true");
    setIsOpen(false);
  };

  const instagramAccount1 = import.meta.env.VITE_INSTAGRAM_ACCOUNT_1 || "gamezone.arena";
  const instagramAccount2 = import.meta.env.VITE_INSTAGRAM_ACCOUNT_2 || "airavoto.gaming";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md max-w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Follow Us on Instagram! 🎮
          </DialogTitle>
          <DialogDescription className="text-center">
            Get exclusive gaming updates, deals, and announcements
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <a
            href={`https://instagram.com/${instagramAccount1}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105"
          >
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">@{instagramAccount1}</div>
              <div className="text-sm text-muted-foreground">Tap to follow</div>
            </div>
          </a>

          <a
            href={`https://instagram.com/${instagramAccount2}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-105"
          >
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">@{instagramAccount2}</div>
              <div className="text-sm text-muted-foreground">Tap to follow</div>
            </div>
          </a>

          <div className="pt-2">
            <Button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6"
            >
              I've Followed Both - Continue
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Follow both accounts to get the latest updates on gaming stations, tournaments, and special offers
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
