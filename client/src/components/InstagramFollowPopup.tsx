import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Instagram, Heart } from "lucide-react";

export function InstagramFollowPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  
  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("instagram-follow-popup-seen");
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleContinue = () => {
    setShowThankYou(true);
    setTimeout(() => {
      localStorage.setItem("instagram-follow-popup-seen", "true");
      setIsOpen(false);
      setShowThankYou(false);
    }, 2500);
  };

  const instagramAccount1 = import.meta.env.VITE_INSTAGRAM_ACCOUNT_1 || "gamezone.arena";
  const instagramAccount2 = import.meta.env.VITE_INSTAGRAM_ACCOUNT_2 || "airavoto.gaming";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[420px] rounded-2xl p-4 sm:p-6">
        {!showThankYou ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-center px-2">
                Follow Us on Instagram! 🎮
              </DialogTitle>
              <DialogDescription className="text-center text-xs sm:text-sm px-2">
                Get exclusive gaming updates, deals, and announcements
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              <a
                href={`https://instagram.com/${instagramAccount1}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20 hover:border-purple-500/40 active:scale-95 transition-all"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={`https://unavatar.io/instagram/${instagramAccount1}`}
                    alt={instagramAccount1}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-purple-500 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-12 w-12 sm:h-14 sm:w-14 items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                    <Instagram className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm sm:text-base truncate">@{instagramAccount1}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Tap to follow</div>
                </div>
                <Instagram className="h-5 w-5 text-purple-500 flex-shrink-0" />
              </a>

              <a
                href={`https://instagram.com/${instagramAccount2}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20 hover:border-purple-500/40 active:scale-95 transition-all"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={`https://unavatar.io/instagram/${instagramAccount2}`}
                    alt={instagramAccount2}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-purple-500 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-12 w-12 sm:h-14 sm:w-14 items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                    <Instagram className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm sm:text-base truncate">@{instagramAccount2}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Tap to follow</div>
                </div>
                <Instagram className="h-5 w-5 text-purple-500 flex-shrink-0" />
              </a>

              <div className="pt-2">
                <Button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-xl"
                >
                  I've Followed Both - Continue
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground px-2 leading-relaxed">
                Follow both accounts to get the latest updates on gaming stations, tournaments, and special offers
              </p>
            </div>
          </>
        ) : (
          <div className="py-6 sm:py-8 text-center space-y-4 sm:space-y-6">
            <div className="flex justify-center">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-pulse">
                <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-white fill-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Thank You! 🎉</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Thanks for following us on Instagram</p>
            </div>

            <div className="flex justify-center gap-3 sm:gap-4">
              <div className="text-center">
                <img
                  src={`https://unavatar.io/instagram/${instagramAccount1}`}
                  alt={instagramAccount1}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-purple-500 shadow-lg mx-auto mb-1"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23a855f7" stroke-width="2"%3E%3Crect x="2" y="2" width="20" height="20" rx="5" ry="5"%3E%3C/rect%3E%3Cpath d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"%3E%3C/path%3E%3Cline x1="17.5" y1="6.5" x2="17.51" y2="6.5"%3E%3C/line%3E%3C/svg%3E';
                  }}
                />
                <p className="text-xs text-muted-foreground truncate max-w-[80px]">@{instagramAccount1}</p>
              </div>
              <div className="text-center">
                <img
                  src={`https://unavatar.io/instagram/${instagramAccount2}`}
                  alt={instagramAccount2}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-purple-500 shadow-lg mx-auto mb-1"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23a855f7" stroke-width="2"%3E%3Crect x="2" y="2" width="20" height="20" rx="5" ry="5"%3E%3C/rect%3E%3Cpath d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"%3E%3C/path%3E%3Cline x1="17.5" y1="6.5" x2="17.51" y2="6.5"%3E%3C/line%3E%3C/svg%3E';
                  }}
                />
                <p className="text-xs text-muted-foreground truncate max-w-[80px]">@{instagramAccount2}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
