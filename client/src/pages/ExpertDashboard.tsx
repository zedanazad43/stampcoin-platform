import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Award, TrendingUp, Clock, CheckCircle, Star, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";

export default function ExpertDashboard() {
  const [expertId, setExpertId] = useState<number | null>(null);

  // Get current user to extract expert ID
  useEffect(() => {
    // In a real app, this would come from auth context
    // For now, we'll use a placeholder
    setExpertId(1);
  }, []);

  const { data: workload } = trpc.experts.getWorkload.useQuery(
    { expertId: expertId! },
    { enabled: !!expertId }
  );

  const { data: stats } = trpc.experts.getStats.useQuery(
    { expertId: expertId! },
    { enabled: !!expertId }
  );

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Expert Dashboard</h1>
          <p className="text-muted-foreground">
            Track your performance and manage authentication assignments
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Authentications</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAuthentications || 0}</div>
              <p className="text-xs text-muted-foreground">All-time completions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expert Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.averageRating ? stats.averageRating.toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">Out of 5.00</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.accuracyRate ? `${(stats.accuracyRate * 100).toFixed(1)}%` : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">Correct authentications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.averageCompletionDays ? `${stats.averageCompletionDays.toFixed(1)}d` : '0d'}
              </div>
              <p className="text-xs text-muted-foreground">Days per task</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Current Workload
              </CardTitle>
              <CardDescription>Your active assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Assignments</span>
                <Badge variant="default">{workload?.activeAssignments || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed</span>
                <Badge variant="secondary">{workload?.completedAssignments || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Completion Time</span>
                <span className="text-sm text-muted-foreground">
                  {workload?.averageCompletionDays ? `${workload.averageCompletionDays.toFixed(1)} days` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Current Capacity</span>
                <span className="text-sm text-muted-foreground">
                  {workload?.currentCapacity || 'Available'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Expertise Areas
              </CardTitle>
              <CardDescription>Your specializations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats?.specialties && stats.specialties.length > 0 ? (
                  stats.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline">
                      {specialty}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No specialties listed</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Feedback from recent authentication work</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentReviews && stats.recentReviews.length > 0 ? (
              <div className="space-y-4">
                {stats.recentReviews.map((review, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviews yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
