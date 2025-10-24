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

const getProfileImageSources = (username: string, customUrl?: string) => {
  const sources = [];
  
  if (customUrl) {
    sources.push(customUrl);
  }
  
  sources.push(
    `https://unavatar.io/instagram/${username}`,
    `https://avatars.githubusercontent.com/${username}`,
    `https://i.pravatar.cc/150?u=${username}`,
    `https://api.dicebear.com/7.x/initials/svg?seed=${username}`
  );
  
  return sources;
};

export function InstagramFollowPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [imageSource1, setImageSource1] = useState(0);
  const [imageSource2, setImageSource2] = useState(0);
  
  useEffect(() => {
    const dismissedUntil = localStorage.getItem("instagram-popup-dismissed-until");
    
    if (dismissedUntil) {
      const dismissedTime = parseInt(dismissedUntil, 10);
      const now = Date.now();
      
      if (now < dismissedTime) {
        return;
      }
    }
    
    setIsOpen(true);
  }, []);

  const extractUsername = (urlOrUsername: string): string => {
    if (!urlOrUsername) return "";
    
    try {
      const url = new URL(urlOrUsername);
      const pathParts = url.pathname.split('/').filter(part => part.length > 0);
      return pathParts[0] || "";
    } catch {
      const cleaned = urlOrUsername.replace('@', '').trim();
      const pathParts = cleaned.split('/').filter(part => part.length > 0);
      return pathParts[0] || cleaned;
    }
  };

  const handleContinue = () => {
    setShowThankYou(true);
    setTimeout(() => {
      setIsOpen(false);
      setShowThankYou(false);
    }, 2500);
  };

  const handleDontShowAgain = () => {
    const tenMinutesFromNow = Date.now() + (10 * 60 * 1000);
    localStorage.setItem("instagram-popup-dismissed-until", tenMinutesFromNow.toString());
    setIsOpen(false);
  };

  const account1Raw = import.meta.env.VITE_INSTAGRAM_ACCOUNT_1 || "gamezone.arena";
  const account2Raw = import.meta.env.VITE_INSTAGRAM_ACCOUNT_2 || "airavoto.gaming";
  
  const instagramAccount1 = extractUsername(account1Raw);
  const instagramAccount2 = extractUsername(account2Raw);
  
  const profileImageSources1 = getProfileImageSources(
    instagramAccount1, 
    import.meta.env.VITE_INSTAGRAM_PROFILE_IMAGE_1
  );
  const profileImageSources2 = getProfileImageSources(
    instagramAccount2, 
    import.meta.env.VITE_INSTAGRAM_PROFILE_IMAGE_2
  );
  
  const handleImageError1 = () => {
    if (imageSource1 < profileImageSources1.length - 1) {
      setImageSource1(prev => prev + 1);
    }
  };
  
  const handleImageError2 = () => {
    if (imageSource2 < profileImageSources2.length - 1) {
      setImageSource2(prev => prev + 1);
    }
  };

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
                    key={`profile1-${imageSource1}`}
                    src={profileImageSources1[imageSource1]}
                    alt={instagramAccount1}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-purple-500 object-cover"
                    onError={handleImageError1}
                  />
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
                    key={`profile2-${imageSource2}`}
                    src={profileImageSources2[imageSource2]}
                    alt={instagramAccount2}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-purple-500 object-cover"
                    onError={handleImageError2}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm sm:text-base truncate">@{instagramAccount2}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Tap to follow</div>
                </div>
                <Instagram className="h-5 w-5 text-purple-500 flex-shrink-0" />
              </a>

              <div className="pt-2 space-y-2">
                <Button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-5 sm:py-6 text-sm sm:text-base rounded-xl"
                >
                  I've Followed Both - Continue
                </Button>
                
                <Button
                  onClick={handleDontShowAgain}
                  variant="ghost"
                  className="w-full text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                >
                  Don't show again for 10 minutes
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
                  key={`thank-you-profile1-${imageSource1}`}
                  src={profileImageSources1[imageSource1]}
                  alt={instagramAccount1}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-purple-500 shadow-lg mx-auto mb-1"
                  onError={handleImageError1}
                />
                <p className="text-xs text-muted-foreground truncate max-w-[80px]">@{instagramAccount1}</p>
              </div>
              <div className="text-center">
                <img
                  key={`thank-you-profile2-${imageSource2}`}
                  src={profileImageSources2[imageSource2]}
                  alt={instagramAccount2}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-purple-500 shadow-lg mx-auto mb-1"
                  onError={handleImageError2}
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
