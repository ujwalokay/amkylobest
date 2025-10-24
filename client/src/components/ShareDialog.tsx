import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Check, Twitter } from "lucide-react";
import { SiWhatsapp, SiFacebook } from "react-icons/si";
import logoImage from "@assets/WhatsApp Image 2025-10-23 at 20.25.44_086fa2cc_1761328905393.jpg";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cafeName: string;
  url: string;
}

export function ShareDialog({ isOpen, onClose, cafeName, url }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareMessage = `🎮 ${cafeName} - Check Live Availability Now!\n\nClick to see real-time gaming station availability! PS5, PC, VR & Racing Simulators available. Book your gaming session now!\n\n${url}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const tempInput = document.createElement('textarea');
      tempInput.value = shareMessage;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `🎮 ${cafeName} - Check Live Availability Now!`,
          text: 'Click to see real-time gaming station availability! PS5, PC, VR & Racing Simulators available.',
          url: url
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[420px] rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
            Share {cafeName}
          </DialogTitle>
        </DialogHeader>

        {/* Preview Image */}
        <div className="my-4">
          <img
            src={logoImage}
            alt="Airavoto Gaming Logo"
            className="w-full h-48 object-contain rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4"
            data-testid="image-share-preview"
          />
        </div>

        {/* Message Preview */}
        <div className="bg-secondary/30 rounded-xl p-4 mb-4">
          <p className="text-sm text-foreground font-semibold mb-2">
            🎮 {cafeName} - Check Live Availability Now!
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Click to see real-time gaming station availability! PS5, PC, VR & Racing Simulators available. Book your gaming session now!
          </p>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          {/* WhatsApp */}
          <Button
            onClick={handleWhatsAppShare}
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center gap-3 h-12 rounded-xl"
            data-testid="button-share-whatsapp"
          >
            <SiWhatsapp className="h-5 w-5" />
            <span className="font-semibold">Share on WhatsApp</span>
          </Button>

          {/* Facebook */}
          <Button
            onClick={handleFacebookShare}
            className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white flex items-center justify-center gap-3 h-12 rounded-xl"
            data-testid="button-share-facebook"
          >
            <SiFacebook className="h-5 w-5" />
            <span className="font-semibold">Share on Facebook</span>
          </Button>

          {/* Twitter */}
          <Button
            onClick={handleTwitterShare}
            className="w-full bg-black hover:bg-gray-900 text-white flex items-center justify-center gap-3 h-12 rounded-xl"
            data-testid="button-share-twitter"
          >
            <Twitter className="h-5 w-5" />
            <span className="font-semibold">Share on Twitter</span>
          </Button>

          {/* More Options / Native Share */}
          <Button
            onClick={handleNativeShare}
            variant="outline"
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2"
            data-testid="button-share-more"
          >
            <Share2 className="h-5 w-5" />
            <span className="font-semibold">More Options</span>
          </Button>

          {/* Copy Link */}
          <Button
            onClick={handleCopyLink}
            variant="secondary"
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl"
            data-testid="button-copy-link"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 text-success" />
                <span className="font-semibold text-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span className="font-semibold">Copy Link</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
