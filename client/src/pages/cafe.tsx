import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  RefreshCw, 
  Star, 
  MapPin, 
  Monitor, 
  Gamepad2, 
  Headset,
  Car,
  Phone,
  Map as MapIcon,
  Wifi,
  Wind,
  Coffee,
  Dribbble,
  Clock,
  Calendar,
  Share2
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import type { Cafe } from "@shared/schema";
import pcSetupImg from "@assets/generated_images/Gaming_cafe_PC_setup_interior_7936e5eb.png";
import consoleAreaImg from "@assets/generated_images/Console_gaming_lounge_area_8b8e7595.png";
import vrZoneImg from "@assets/generated_images/VR_gaming_zone_setup_ef3d2698.png";
import { SplashScreen } from "@/components/SplashScreen";
import { InstagramFollowPopup } from "@/components/InstagramFollowPopup";

export default function CafePage() {
  const { data: cafe, isLoading } = useQuery<Cafe>({
    queryKey: ["/api/cafe"],
  });

  const [showSplash, setShowSplash] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const cafeImages = [
    { src: pcSetupImg, alt: "Gaming PC Setup" },
    { src: consoleAreaImg, alt: "Console Gaming Area" },
    { src: vrZoneImg, alt: "VR Gaming Zone" }
  ];

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && minTimeElapsed) {
      setShowSplash(false);
    }
  }, [isLoading, minTimeElapsed]);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!cafe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Cafe not found</div>
      </div>
    );
  }

  const getStationIcon = (type: string) => {
    switch (type) {
      case "PC":
        return Monitor;
      case "PS5":
        return Gamepad2;
      case "VR":
        return Headset;
      case "Racing Sim":
        return Car;
      default:
        return Monitor;
    }
  };

  const getAmenityIcon = (name: string) => {
    if (name.toLowerCase().includes("wifi")) return Wifi;
    if (name.toLowerCase().includes("air")) return Wind;
    if (name.toLowerCase().includes("snack") || name.toLowerCase().includes("drink")) return Coffee;
    if (name.toLowerCase().includes("headset")) return Headset;
    if (name.toLowerCase().includes("vr")) return Headset;
    if (name.toLowerCase().includes("racing")) return Car;
    return Dribbble;
  };

  const pcGames = cafe.games.filter(game => game.platform === "PC");
  const ps5Games = cafe.games.filter(game => game.platform === "PS5");

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cafe?.name} - Gaming Cafe`,
          text: `Check out ${cafe?.name} - Premium gaming cafe`,
          url: url
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copied to clipboard!');
    }).catch(() => {
      const tempInput = document.createElement('input');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      alert('Link copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground" data-testid="text-powered-by">
            Powered by <span className="font-semibold text-primary">Airavoto Gaming</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="secondary"
              className="rounded-full"
              data-testid="button-share"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary"
              className="rounded-full"
              data-testid="button-refresh"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-4 space-y-4">
        {/* Cafe Images Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl" ref={emblaRef} data-testid="carousel-cafe-images">
            <div className="flex">
              {cafeImages.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 object-cover"
                    data-testid={`image-cafe-${index}`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Animated Dots Indicator */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
            {cafeImages.map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 rounded-full ${
                  index === selectedIndex
                    ? 'w-8 h-2 bg-primary'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                data-testid={`carousel-dot-${index}`}
              />
            ))}
          </div>
        </div>

        {/* Header Card */}
        <Card className="p-4 border-card-border" data-testid="card-cafe-header">
          <h1 className="text-2xl font-bold text-foreground mb-2" data-testid="text-cafe-name">
            {cafe.name}
          </h1>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 bg-primary px-2 py-1 rounded-md" data-testid="badge-rating">
              <Star className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
              <span className="text-primary-foreground font-medium">{cafe.rating}</span>
            </div>
            <div className="flex items-center gap-1" data-testid="text-location">
              <MapPin className="h-3 w-3" />
              <span>{cafe.location}</span>
            </div>
            <div data-testid="text-distance">• {cafe.distance}</div>
          </div>
        </Card>

        {/* Gaming Stations Grid */}
        <div className="grid grid-cols-2 gap-3">
          {cafe.gamingStations.map((station) => {
            const Icon = getStationIcon(station.type);
            const isLimited = station.available <= Math.floor(station.total * 0.3);
            
            return (
              <Card 
                key={station.id} 
                className="p-4 border-card-border hover-elevate transition-transform duration-200"
                data-testid={`card-station-${station.type.toLowerCase().replace(" ", "-")}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Icon className="h-5 w-5 text-primary" data-testid={`icon-station-${station.type.toLowerCase().replace(" ", "-")}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground" data-testid={`text-station-type-${station.id}`}>
                    {station.type}
                  </span>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1" data-testid={`text-availability-${station.id}`}>
                  {station.available}/{station.total}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${isLimited ? 'bg-warning' : 'bg-success'}`} data-testid={`indicator-status-${station.id}`} />
                  <span className="text-xs text-muted-foreground" data-testid={`text-status-${station.id}`}>
                    {station.status}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* About Section */}
        <Card className="p-4 border-card-border" data-testid="card-about">
          <div className="flex items-center gap-2 mb-3">
            <Dribbble className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">About</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-about-description">
            {cafe.about}
          </p>
        </Card>

        {/* Operating Hours Schedule */}
        {cafe.schedule && cafe.schedule.length > 0 && (
          <Card className="p-4 border-card-border" data-testid="card-schedule">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Operating Hours</h2>
            </div>
            
            <div className="space-y-2">
              {cafe.schedule.map((schedule, index) => {
                const now = new Date();
                const today = now.toLocaleDateString('en-US', { weekday: 'long' });
                const isToday = schedule.day === today;
                
                // Check if it's currently peak hours (only show on today during 6 PM - 11 PM)
                const hour = now.getHours();
                const isPeakDay = schedule.day === 'Friday' || schedule.day === 'Saturday' || schedule.day === 'Sunday';
                const isPeakTime = hour >= 18 && hour < 23;
                const showPeakNow = isToday && isPeakDay && isPeakTime;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                      isToday 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-secondary/5'
                    }`}
                    data-testid={`schedule-${schedule.day.toLowerCase()}`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                        {schedule.day}
                        {isToday && (
                          <Badge variant="outline" className="ml-2 text-xs border-primary text-primary">
                            Today
                          </Badge>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {schedule.openTime} - {schedule.closeTime}
                      </span>
                      {showPeakNow && (
                        <Badge variant="secondary" className="text-xs bg-warning/20 text-warning border-warning/30">
                          Peak Now
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {cafe.peakHoursInfo && cafe.peakHoursInfo.includes("🔥") && (
              <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {cafe.peakHoursInfo}
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Available Games Section */}
        <Card className="p-4 border-card-border" data-testid="card-available-games">
          <div className="flex items-center gap-2 mb-3">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Available Games</h2>
          </div>
          
          {/* PC Games */}
          {pcGames.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">PC Games</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {pcGames.map((game) => (
                  <Badge 
                    key={game.id} 
                    variant="secondary" 
                    className="rounded-full px-3 py-1.5 text-xs border-border"
                    data-testid={`badge-game-${game.id}`}
                  >
                    {game.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* PS5 Games */}
          {ps5Games.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">PS5 Games</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {ps5Games.map((game) => (
                  <Badge 
                    key={game.id} 
                    variant="secondary" 
                    className="rounded-full px-3 py-1.5 text-xs border-border"
                    data-testid={`badge-game-${game.id}`}
                  >
                    {game.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Amenities Section */}
        <Card className="p-4 border-card-border" data-testid="card-amenities">
          <h2 className="text-lg font-semibold text-foreground mb-4">Amenities</h2>
          <div className="grid grid-cols-4 gap-4">
            {cafe.amenities.map((amenity) => {
              const Icon = getAmenityIcon(amenity.name);
              return (
                <div 
                  key={amenity.id} 
                  className="flex flex-col items-center gap-2 text-center"
                  data-testid={`amenity-${amenity.id}`}
                >
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs text-foreground leading-tight">
                    {amenity.name}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border">
        <div className="grid grid-cols-3 gap-2 p-3">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-1.5 h-auto py-3 bg-chart-2/10 border-chart-2/30"
            data-testid="button-call"
            onClick={() => cafe.phoneNumber && window.open(`tel:${cafe.phoneNumber}`)}
          >
            <Phone className="h-5 w-5 text-chart-2" />
            <span className="text-xs text-chart-2 font-medium">Call</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center gap-1.5 h-auto py-3 bg-success/10 border-success/30"
            data-testid="button-whatsapp"
            onClick={() => cafe.whatsappNumber && window.open(`https://wa.me/${cafe.whatsappNumber}`)}
          >
            <SiWhatsapp className="h-5 w-5 text-success" />
            <span className="text-xs text-success font-medium">WhatsApp</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center gap-1.5 h-auto py-3 bg-primary/10 border-primary/30"
            data-testid="button-map"
            onClick={() => cafe.mapUrl && window.open(cafe.mapUrl, '_blank')}
          >
            <MapIcon className="h-5 w-5 text-primary" />
            <span className="text-xs text-primary font-medium">Map</span>
          </Button>
        </div>
      </div>

      {/* Instagram Follow Popup */}
      <InstagramFollowPopup />
    </div>
  );
}
