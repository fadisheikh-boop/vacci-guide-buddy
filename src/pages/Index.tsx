import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VaccinationForm from '@/components/VaccinationForm';
import VaccinationResults from '@/components/VaccinationResults';
import { Shield, Users, Award, Stethoscope } from 'lucide-react';
import medicalHeroImage from '@/assets/medical-hero.jpg';

interface VaccinationData {
  age: string;
  knownHistory: boolean;
  completedVaccines: string[];
  riskFactors: string[];
  occupation: string;
}

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [vaccinationData, setVaccinationData] = useState<VaccinationData | null>(null);

  const handleFormSubmit = (data: VaccinationData) => {
    setVaccinationData(data);
    setShowResults(true);
  };

  const handleBackToForm = () => {
    setShowResults(false);
  };

  if (showResults && vaccinationData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <VaccinationResults data={vaccinationData} onBack={handleBackToForm} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-primary to-accent text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                  ACIP Guidelines Compliant
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  VacciGuide
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                  Get personalized vaccination recommendations based on your health profile
                </p>
              </div>
              <p className="text-lg text-white/80">
                Our evidence-based tool follows American College guidelines to help you 
                understand which vaccines you need based on your age, medical history, 
                and risk factors.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/90">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">ACIP Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">All Ages</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Award className="w-5 h-5" />
                  <span className="text-sm">Evidence-Based</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={medicalHeroImage} 
                alt="Medical professional with stethoscope and vaccination symbols"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <section className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Start Your Vaccination Assessment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions about your age, vaccination history, and health conditions 
              to receive personalized recommendations following the latest medical guidelines.
            </p>
          </section>

          {/* Features */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <Shield className="w-8 h-8 text-medical-blue mx-auto mb-2" />
                <CardTitle className="text-lg">Evidence-Based</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Recommendations based on CDC's Advisory Committee on Immunization Practices (ACIP) guidelines
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Stethoscope className="w-8 h-8 text-medical-green mx-auto mb-2" />
                <CardTitle className="text-lg">Personalized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tailored recommendations based on your specific age, health conditions, and risk factors
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-lg">Comprehensive</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Covers all age groups and special populations including healthcare workers and travelers
                </CardDescription>
              </CardContent>
            </Card>
          </section>

          {/* Form Section */}
          <section>
            <VaccinationForm onSubmit={handleFormSubmit} />
          </section>

          {/* Disclaimer */}
          <section className="mt-12 p-6 bg-medical-light rounded-lg border border-medical-blue/20">
            <h3 className="font-semibold text-foreground mb-2">Medical Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              This tool provides general vaccination recommendations based on CDC guidelines and should not 
              replace professional medical advice. Always consult with your healthcare provider before making 
              vaccination decisions. Individual circumstances may require different approaches to immunization.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;