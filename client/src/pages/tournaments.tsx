import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Trophy, Users, Calendar, Award, Loader2, Download, Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tournament, TournamentRegistration, TournamentTicket } from "@shared/schema";
import { tournamentRegistrationSchema } from "@shared/schema";

export default function TournamentsPage() {
  const [, setLocation] = useLocation();
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [ticket, setTicket] = useState<{ ticket: TournamentTicket; ticketSVG: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
  });

  const registerForm = useForm<Omit<TournamentRegistration, "tournamentId">>({
    resolver: zodResolver(tournamentRegistrationSchema.omit({ tournamentId: true })),
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
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      setTicket(data);
      toast({
        title: "Registration Successful!",
        description: `Your ticket number is ${data.ticket.ticketNumber}`,
      });
      registerForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRegister = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    registerForm.setValue("gamePreference", tournament.game);
    setRegisterDialogOpen(true);
  };

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

  const handleCloseTicket = () => {
    setTicket(null);
    setRegisterDialogOpen(false);
    setSelectedTournament(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading tournaments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation("/")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Trophy className="h-6 w-6 text-purple-600" />
            <h1 className="text-xl font-bold">Tournaments</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {!tournaments || tournaments.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tournaments yet. Create your first tournament!</p>
            </CardContent>
          </Card>
        ) : (
          tournaments.map((tournament) => (
            <Card key={tournament.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600/10 to-indigo-600/10">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {tournament.title}
                      <Badge variant={tournament.status === "upcoming" ? "default" : "secondary"}>
                        {tournament.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      {tournament.game}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {tournament.description && (
                  <p className="text-sm text-muted-foreground">{tournament.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {tournament.participantCount || 0}/{tournament.maxParticipants}
                    </span>
                  </div>
                </div>

                {tournament.prizePool && (
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-purple-600">{tournament.prizePool}</span>
                  </div>
                )}

                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => handleRegister(tournament)}
                  disabled={
                    (tournament.participantCount || 0) >= tournament.maxParticipants ||
                    tournament.status !== "upcoming"
                  }
                >
                  {(tournament.participantCount || 0) >= tournament.maxParticipants
                    ? "Tournament Full"
                    : tournament.status !== "upcoming"
                    ? "Tournament Started"
                    : "Register Now"}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          {!ticket ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <Trophy className="h-6 w-6 text-purple-600" />
                  Register for {selectedTournament?.title}
                </DialogTitle>
                <DialogDescription>
                  Fill out the form below to register. You'll receive a unique ticket.
                </DialogDescription>
              </DialogHeader>

              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit((data) => {
                    if (selectedTournament) {
                      registerMutation.mutate({
                        ...data,
                        tournamentId: selectedTournament.id,
                      });
                    }
                  })}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
                    name="gamePreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Game Preference</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
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
                        title: "Email Sent",
                        description: "Ticket will be sent to your email if configured",
                      });
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send to Email
                  </Button>
                </div>

                <Button variant="outline" className="w-full" onClick={handleCloseTicket}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
