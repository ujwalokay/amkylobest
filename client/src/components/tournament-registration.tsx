import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { tournamentRegistrationSchema, type TournamentRegistration, type TournamentTicket } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Download, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TournamentRegistration() {
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState<{ ticket: TournamentTicket; ticketSVG: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<TournamentRegistration>({
    resolver: zodResolver(tournamentRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gamePreference: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: TournamentRegistration) => {
      const response = await fetch("/api/tournament/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to register");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setTicket(data);
      toast({
        title: "Registration Successful!",
        description: `Your ticket number is ${data.ticket.ticketNumber}`,
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDownload = () => {
    if (!ticket) return;

    const blob = new Blob([ticket.ticketSVG], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tournament-ticket-${ticket.ticket.ticketNumber}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Ticket Downloaded",
      description: "Your tournament ticket has been downloaded",
    });
  };

  const handleClose = () => {
    setOpen(false);
    setTicket(null);
    form.reset();
  };

  const games = [
    "GTA V",
    "Valorant",
    "CS:GO",
    "Fortnite",
    "PUBG",
    "Minecraft",
    "FIFA 23",
    "Spider-Man 2",
    "God of War",
    "Gran Turismo 7",
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          size="lg"
        >
          <Trophy className="mr-2 h-5 w-5" />
          Register for Tournament
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {!ticket ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="h-6 w-6 text-purple-600" />
                Tournament Registration
              </DialogTitle>
              <DialogDescription>
                Fill out the form below to register for the tournament. You'll receive a unique ticket with a 5-digit number.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gamePreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game Preference</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a game" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {games.map((game) => (
                            <SelectItem key={game} value={game}>
                              {game}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Now"
                  )}
                </Button>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="h-6 w-6 text-purple-600" />
                Registration Successful!
              </DialogTitle>
              <DialogDescription>
                Your tournament ticket has been generated. Download it or we'll send it to your email.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Your Ticket Number</p>
                  <p className="text-4xl font-bold text-purple-600">{ticket.ticket.ticketNumber}</p>
                </div>
              </div>

              <div
                className="border rounded-lg overflow-hidden"
                dangerouslySetInnerHTML={{ __html: ticket.ticketSVG }}
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Ticket
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    toast({
                      title: "Email Feature",
                      description: "Email integration will be set up to send tickets automatically",
                    });
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send to Email
                </Button>
              </div>

              <Button variant="outline" className="w-full" onClick={handleClose}>
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
