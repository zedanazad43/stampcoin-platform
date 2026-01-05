import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Activity, 
  BarChart3,
  Calendar,
  Download
} from "lucide-react";

export default function PartnerDashboard() {
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  // Get current partner ID from auth context
  useEffect(() => {
    // In a real app, this would come from auth context
    setPartnerId(1);
  }, []);

  const { data: dashboard } = trpc.partnerships.getDashboard.useQuery(
    { partnerId: partnerId! },
    { enabled: !!partnerId }
  );

  const { data: metrics } = trpc.partnerships.getMetrics.useQuery(
    { partnerId: partnerId! },
    { enabled: !!partnerId }
  );

  const generateReport = trpc.partnerships.generateReport.useMutation({
    onSuccess: (data) => {
      if (data.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
      }
    },
  });

  const handleGenerateReport = () => {
    if (partnerId) {
      generateReport.mutate({ partnerId, period });
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Partner Dashboard</h1>
            <p className="text-muted-foreground">
              {dashboard?.partnership.organizationName || 'Your Partnership Performance'}
            </p>
          </div>
          <Badge variant={dashboard?.partnership.status === 'active' ? 'default' : 'secondary'} className="text-sm">
            {dashboard?.partnership.status || 'Pending'}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${dashboard?.performance.totalRevenue || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">All-time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partner Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${dashboard?.performance.partnerEarnings || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboard?.partnership.revenueShare || 70}% revenue share
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stamps Sold</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard?.performance.stampsSold || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboard?.performance.stampsListed || 0} listed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboard?.performance.monthlyGrowth !== undefined 
                  ? `${dashboard.performance.monthlyGrowth > 0 ? '+' : ''}${dashboard.performance.monthlyGrowth.toFixed(1)}%`
                  : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">vs. last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Stamps</CardTitle>
                  <CardDescription>Best sellers from your collection</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboard?.topStamps && dashboard.topStamps.length > 0 ? (
                    <div className="space-y-3">
                      {dashboard.topStamps.map((stamp) => (
                        <div key={stamp.stampId} className="flex justify-between items-center border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium text-sm">{stamp.name}</p>
                            <p className="text-xs text-muted-foreground">{stamp.sales} sales</p>
                          </div>
                          <span className="font-bold">${stamp.revenue}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No sales data yet
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest partnership events</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboard?.recentActivity && dashboard.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {dashboard.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 border-b pb-2 last:border-0">
                          <div className="flex-1">
                            <p className="text-sm">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent activity
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Partnership Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium mb-1">Organization Type</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {dashboard?.partnership.organizationType.replace(/_/g, ' ') || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Contract Status</p>
                    <Badge variant={dashboard?.partnership.contractSigned ? 'default' : 'secondary'}>
                      {dashboard?.partnership.contractSigned ? 'Signed' : 'Pending'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {dashboard?.partnership.startDate 
                        ? new Date(dashboard.partnership.startDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Stamps Contributed</p>
                    <p className="text-sm text-muted-foreground">
                      {dashboard?.partnership.contributedStamps || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quality Metrics
                </CardTitle>
                <CardDescription>Your partnership performance scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Quality Score</span>
                      <span className="text-sm font-bold">{metrics?.qualityScore || 0}/100</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${metrics?.qualityScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Timeliness Score</span>
                      <span className="text-sm font-bold">{metrics?.timelinessScore || 0}/100</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${metrics?.timelinessScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Documentation Score</span>
                      <span className="text-sm font-bold">{metrics?.documentationScore || 0}/100</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${metrics?.documentationScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Response Score</span>
                      <span className="text-sm font-bold">{metrics?.responseScore || 0}/100</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${metrics?.responseScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Rating</span>
                      <Badge variant={
                        metrics?.overallRating === 'excellent' ? 'default' :
                        metrics?.overallRating === 'good' ? 'default' :
                        metrics?.overallRating === 'fair' ? 'secondary' : 'secondary'
                      }>
                        {metrics?.overallRating || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Sale Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${dashboard?.performance.averageSalePrice || '0.00'}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {dashboard?.performance.stampsSold || 0} completed sales
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Generate Partnership Report
                </CardTitle>
                <CardDescription>Download detailed performance reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Period</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={period === 'monthly' ? 'default' : 'outline'}
                      onClick={() => setPeriod('monthly')}
                    >
                      Monthly
                    </Button>
                    <Button
                      type="button"
                      variant={period === 'quarterly' ? 'default' : 'outline'}
                      onClick={() => setPeriod('quarterly')}
                    >
                      Quarterly
                    </Button>
                    <Button
                      type="button"
                      variant={period === 'annual' ? 'default' : 'outline'}
                      onClick={() => setPeriod('annual')}
                    >
                      Annual
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateReport}
                  disabled={generateReport.isPending}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {generateReport.isPending ? 'Generating...' : 'Generate Report'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
