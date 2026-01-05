import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { toast } from "sonner";
import { Award, FileText, Users, Plus, X } from "lucide-react";

const EXPERTISE_AREAS = [
  { value: 'victorian_stamps', label: 'Victorian Stamps' },
  { value: 'modern_european', label: 'Modern European' },
  { value: 'asian_philately', label: 'Asian Philately' },
  { value: 'rare_classics', label: 'Rare Classics' },
  { value: 'postage_due', label: 'Postage Due' },
  { value: 'airmail', label: 'Airmail' },
  { value: 'commemoratives', label: 'Commemoratives' },
  { value: 'postal_history', label: 'Postal History' },
  { value: 'forgery_detection', label: 'Forgery Detection' },
  { value: 'conservation', label: 'Conservation' },
];

interface Reference {
  name: string;
  organization: string;
  contact: string;
}

export default function ExpertApplication() {
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [credentials, setCredentials] = useState('');
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');
  const [references, setReferences] = useState<Reference[]>([
    { name: '', organization: '', contact: '' }
  ]);
  const [certifications, setCertifications] = useState<string[]>(['']);

  const applyMutation = trpc.experts.applyAsExpert.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      // Reset form
      setExpertiseAreas([]);
      setCredentials('');
      setExperience('');
      setMotivation('');
      setReferences([{ name: '', organization: '', contact: '' }]);
      setCertifications(['']);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (expertiseAreas.length === 0) {
      toast.error('Please select at least one expertise area');
      return;
    }

    const validReferences = references.filter(ref => ref.name && ref.organization && ref.contact);
    if (validReferences.length === 0) {
      toast.error('Please provide at least one reference');
      return;
    }

    const validCertifications = certifications.filter(cert => cert.trim());

    applyMutation.mutate({
      expertiseAreas,
      credentials,
      experience,
      references: validReferences,
      certifications: validCertifications,
      motivation,
    });
  };

  const addReference = () => {
    setReferences([...references, { name: '', organization: '', contact: '' }]);
  };

  const removeReference = (index: number) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  const updateReference = (index: number, field: keyof Reference, value: string) => {
    const updated = [...references];
    updated[index][field] = value;
    setReferences(updated);
  };

  const addCertification = () => {
    setCertifications([...certifications, '']);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, value: string) => {
    const updated = [...certifications];
    updated[index] = value;
    setCertifications(updated);
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Become an Expert</h1>
          <p className="text-muted-foreground">
            Join our network of philatelic experts and help authenticate rare stamps worldwide.
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Expert Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Earn competitive compensation for authentication services</li>
                <li>• Build your professional reputation in the philatelic community</li>
                <li>• Access to exclusive stamp collections and rare specimens</li>
                <li>• Flexible work schedule - accept assignments at your convenience</li>
                <li>• Join a global network of philately professionals</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expertise & Credentials</CardTitle>
              <CardDescription>Tell us about your philatelic expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expertise">Areas of Expertise *</Label>
                <Select
                  onValueChange={(value) => {
                    if (!expertiseAreas.includes(value)) {
                      setExpertiseAreas([...expertiseAreas, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expertise areas" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERTISE_AREAS.map((area) => (
                      <SelectItem key={area.value} value={area.value}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {expertiseAreas.map((area) => {
                    const label = EXPERTISE_AREAS.find(a => a.value === area)?.label || area;
                    return (
                      <div key={area} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {label}
                        <button
                          type="button"
                          onClick={() => setExpertiseAreas(expertiseAreas.filter(a => a !== area))}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentials">Credentials *</Label>
                <Input
                  id="credentials"
                  placeholder="e.g., PhD in Philately, APS Certified Expert #12345"
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Professional Experience *</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your professional experience in philately..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation">Why do you want to join? *</Label>
                <Textarea
                  id="motivation"
                  placeholder="Tell us what motivates you to become an expert on our platform..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  required
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Professional References
              </CardTitle>
              <CardDescription>Provide at least one professional reference</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {references.map((ref, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold">Reference {index + 1}</Label>
                    {references.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReference(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Input
                      placeholder="Full Name"
                      value={ref.name}
                      onChange={(e) => updateReference(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Organization"
                      value={ref.organization}
                      onChange={(e) => updateReference(index, 'organization', e.target.value)}
                    />
                    <Input
                      placeholder="Contact (email or phone)"
                      value={ref.contact}
                      onChange={(e) => updateReference(index, 'contact', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addReference} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Reference
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Certifications (Optional)
              </CardTitle>
              <CardDescription>Provide URLs to certification documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://example.com/certification.pdf"
                    value={cert}
                    onChange={(e) => updateCertification(index, e.target.value)}
                  />
                  {certifications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCertification(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addCertification} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={applyMutation.isPending}>
            {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
