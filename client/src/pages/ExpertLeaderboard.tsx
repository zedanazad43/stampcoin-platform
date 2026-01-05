import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Award, TrendingUp, Trophy, Medal } from "lucide-react";

export default function ExpertLeaderboard() {
  const { data: leaderboard, isLoading } = trpc.experts.getLeaderboard.useQuery({ limit: 50 });

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2 flex items-center gap-3">
            <Trophy className="h-10 w-10 text-yellow-500" />
            Expert Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Top performing philatelic experts in our global network
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        ) : leaderboard && leaderboard.length > 0 ? (
          <div className="space-y-4">
            {leaderboard.map((entry) => {
              const getRankIcon = (rank: number) => {
                if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
                if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
                if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
                return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>;
              };

              const getRankBadge = (rank: number) => {
                if (rank === 1) return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
                if (rank === 2) return "bg-gray-400/10 text-gray-600 border-gray-400/20";
                if (rank === 3) return "bg-amber-600/10 text-amber-700 border-amber-600/20";
                return "";
              };

              return (
                <Card key={entry.expert.userId} className={`${getRankBadge(entry.rank)} border-2`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div>
                          <CardTitle className="text-2xl">{entry.expert.name}</CardTitle>
                          <CardDescription>{entry.expert.email}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <Award className="h-5 w-5 text-yellow-500" />
                          <span className="text-2xl font-bold">
                            {entry.expert.expertRating.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Expert Rating</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3 mb-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Total Authentications</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-2xl font-bold">{entry.expert.totalAuthentications}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Performance Score</p>
                        <span className="text-2xl font-bold">{entry.score.toFixed(2)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Verified Expert</p>
                        <Badge variant={entry.expert.verifiedExpert ? "default" : "secondary"}>
                          {entry.expert.verifiedExpert ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Expertise Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {entry.expert.expertiseAreas.map((area) => (
                          <Badge key={area} variant="outline">
                            {area.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {entry.expert.credentials && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-1">Credentials</p>
                        <p className="text-sm text-muted-foreground">{entry.expert.credentials}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No experts in the leaderboard yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
