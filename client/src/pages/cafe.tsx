import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
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
  Dribbble
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { Cafe } from "@shared/schema";

export default function CafePage() {
  const { data: cafe, isLoading } = useQuery<Cafe>({
    queryKey: ["/api/cafe"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button 
          size="icon" 
          variant="secondary"
          className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
          data-testid="button-back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-4 space-y-4">
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
          <div className="grid grid-cols-3 gap-4">
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
            className="flex flex-col items-center gap-1.5 h-auto py-3 bg-chart-2/10 border-chart-2/30 hover:bg-chart-2/20"
            data-testid="button-call"
            onClick={() => cafe.phoneNumber && window.open(`tel:${cafe.phoneNumber}`)}
          >
            <Phone className="h-5 w-5 text-chart-2" />
            <span className="text-xs text-chart-2 font-medium">Call</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center gap-1.5 h-auto py-3 bg-success/10 border-success/30 hover:bg-success/20"
            data-testid="button-whatsapp"
            onClick={() => cafe.whatsappNumber && window.open(`https://wa.me/${cafe.whatsappNumber}`)}
          >
            <SiWhatsapp className="h-5 w-5 text-success" />
            <span className="text-xs text-success font-medium">WhatsApp</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center gap-1.5 h-auto py-3 bg-primary/10 border-primary/30 hover:bg-primary/20"
            data-testid="button-map"
            onClick={() => cafe.mapUrl && window.open(cafe.mapUrl, '_blank')}
          >
            <MapIcon className="h-5 w-5 text-primary" />
            <span className="text-xs text-primary font-medium">Map</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
