import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { toast } from "sonner";
import { Handshake, Building2, Globe, DollarSign, FileText, Send } from "lucide-react";

const ORGANIZATION_TYPES = [
  { value: 'auction_house', label: 'Auction House' },
  { value: 'museum', label: 'Museum' },
  { value: 'postal_service', label: 'Postal Service' },
  { value: 'dealer', label: 'Stamp Dealer' },
  { value: 'collector_society', label: 'Collector Society' },
  { value: 'academic', label: 'Academic Institution' },
];

const MARKET_ACCESS_OPTIONS = [
  'Online Sales',
  'Physical Auctions',
  'Private Sales',
  'Exhibitions',
  'Educational Programs',
  'Research Access',
];

export default function PartnershipProposal() {
  const [formData, setFormData] = useState({
    organizationType: '',
    organizationName: '',
    country: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    proposedCollaboration: '',
    collectionSize: '',
    digitalizationCapability: false,
    authenticationCapability: false,
    revenueShareProposal: '',
    exclusivityRequested: false,
  });
  const [marketAccess, setMarketAccess] = useState<string[]>([]);

  const proposalMutation = trpc.partnerships.submitProposal.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      // Reset form
      setFormData({
        organizationType: '',
        organizationName: '',
        country: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        proposedCollaboration: '',
        collectionSize: '',
        digitalizationCapability: false,
        authenticationCapability: false,
        revenueShareProposal: '',
        exclusivityRequested: false,
      });
      setMarketAccess([]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.organizationType) {
      toast.error('Please select an organization type');
      return;
    }

    proposalMutation.mutate({
      organizationType: formData.organizationType as any,
      organizationName: formData.organizationName,
      country: formData.country,
      contactPerson: formData.contactPerson,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      proposedCollaboration: formData.proposedCollaboration,
      collectionSize: formData.collectionSize ? parseInt(formData.collectionSize) : undefined,
      digitalizationCapability: formData.digitalizationCapability,
      authenticationCapability: formData.authenticationCapability,
      marketAccess,
      revenueShareProposal: formData.revenueShareProposal ? parseFloat(formData.revenueShareProposal) : undefined,
      exclusivityRequested: formData.exclusivityRequested,
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleMarketAccess = (option: string) => {
    setMarketAccess(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2 flex items-center gap-3">
            <Handshake className="h-10 w-10" />
            Partnership Proposal
          </h1>
          <p className="text-muted-foreground">
            Join our global network and help preserve philatelic heritage
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Partnership Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Earn up to 80% revenue share on stamp sales</li>
                <li>• Global marketplace exposure for your collection</li>
                <li>• Professional NFT conversion and blockchain hosting</li>
                <li>• Advanced authentication and provenance tracking</li>
                <li>• Marketing and promotional support</li>
                <li>• Dedicated partner account manager</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Information
              </CardTitle>
              <CardDescription>Tell us about your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organizationType">Organization Type *</Label>
                <Select
                  value={formData.organizationType}
                  onValueChange={(value) => updateField('organizationType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    placeholder="British Postal Museum"
                    value={formData.organizationName}
                    onChange={(e) => updateField('organizationName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    placeholder="United Kingdom"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Primary contact for this partnership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  placeholder="John Smith"
                  value={formData.contactPerson}
                  onChange={(e) => updateField('contactPerson', e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="john@museum.org"
                    value={formData.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone (Optional)</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+44 20 1234 5678"
                    value={formData.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Collaboration Details
              </CardTitle>
              <CardDescription>Describe your proposed collaboration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proposedCollaboration">Proposed Collaboration *</Label>
                <Textarea
                  id="proposedCollaboration"
                  placeholder="Describe your vision for collaboration, what you can offer, and what you hope to achieve..."
                  value={formData.proposedCollaboration}
                  onChange={(e) => updateField('proposedCollaboration', e.target.value)}
                  required
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collectionSize">Collection Size (Optional)</Label>
                <Input
                  id="collectionSize"
                  type="number"
                  placeholder="Number of stamps"
                  value={formData.collectionSize}
                  onChange={(e) => updateField('collectionSize', e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Capabilities</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="digitalization"
                      checked={formData.digitalizationCapability}
                      onCheckedChange={(checked) => updateField('digitalizationCapability', checked)}
                    />
                    <label htmlFor="digitalization" className="text-sm cursor-pointer">
                      We have digitalization capability (high-res scanning)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="authentication"
                      checked={formData.authenticationCapability}
                      onCheckedChange={(checked) => updateField('authenticationCapability', checked)}
                    />
                    <label htmlFor="authentication" className="text-sm cursor-pointer">
                      We can provide authentication services
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Market Access</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  {MARKET_ACCESS_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={marketAccess.includes(option)}
                        onCheckedChange={() => toggleMarketAccess(option)}
                      />
                      <label htmlFor={option} className="text-sm cursor-pointer">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Terms (Optional)
              </CardTitle>
              <CardDescription>Propose your preferred revenue sharing model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="revenueShare">Proposed Revenue Share % (Optional)</Label>
                <Input
                  id="revenueShare"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 70"
                  value={formData.revenueShareProposal}
                  onChange={(e) => updateField('revenueShareProposal', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Standard tiers: Bronze (60%), Silver (65%), Gold (70%), Platinum (75%), Diamond (80%)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exclusivity"
                  checked={formData.exclusivityRequested}
                  onCheckedChange={(checked) => updateField('exclusivityRequested', checked)}
                />
                <label htmlFor="exclusivity" className="text-sm cursor-pointer">
                  Request exclusive digital rights
                </label>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={proposalMutation.isPending}>
            {proposalMutation.isPending ? 'Submitting...' : 'Submit Partnership Proposal'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By submitting this proposal, you agree to our partnership terms and conditions.
            Our team will review your proposal and contact you within 48 hours.
          </p>
        </form>
      </div>
    </DashboardLayout>
  );
}
