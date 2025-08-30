import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Shield, AlertTriangle } from 'lucide-react';

interface VaccinationData {
  age: string;
  knownHistory: boolean;
  completedVaccines: string[];
  riskFactors: string[];
  occupation: string;
}

interface VaccinationFormProps {
  onSubmit: (data: VaccinationData) => void;
}

const commonVaccines = [
  'MMR (Measles, Mumps, Rubella)',
  'DTaP/Tdap (Diphtheria, Tetanus, Pertussis)',
  'Polio (IPV)',
  'Hepatitis A',
  'Hepatitis B',
  'Varicella (Chickenpox)',
  'HPV (Human Papillomavirus)',
  'Meningococcal',
  'Pneumococcal',
  'Influenza (Annual)',
  'COVID-19',
  'Shingles (Zoster)'
];

const riskFactors = [
  'Immunocompromised',
  'Chronic heart disease',
  'Chronic lung disease',
  'Diabetes',
  'Chronic kidney disease',
  'Chronic liver disease',
  'Cancer',
  'HIV/AIDS',
  'Pregnant',
  'Healthcare worker',
  'International travel',
  'College student'
];

export default function VaccinationForm({ onSubmit }: VaccinationFormProps) {
  const [formData, setFormData] = useState<VaccinationData>({
    age: '',
    knownHistory: false,
    completedVaccines: [],
    riskFactors: [],
    occupation: ''
  });

  const handleVaccineChange = (vaccine: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        completedVaccines: [...prev.completedVaccines, vaccine]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        completedVaccines: prev.completedVaccines.filter(v => v !== vaccine)
      }));
    }
  };

  const handleRiskFactorChange = (factor: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        riskFactors: [...prev.riskFactors, factor]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        riskFactors: prev.riskFactors.filter(f => f !== factor)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Age Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Please provide your age to determine age-appropriate recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              min="0"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              required
              className="max-w-32"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vaccination History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-medical-green" />
            Vaccination History
          </CardTitle>
          <CardDescription>
            Do you know your vaccination history? If yes, please select all vaccines you have received.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="knownHistory"
              checked={formData.knownHistory}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ 
                  ...prev, 
                  knownHistory: checked as boolean,
                  completedVaccines: checked ? prev.completedVaccines : []
                }))
              }
            />
            <Label htmlFor="knownHistory">I know my vaccination history</Label>
          </div>

          {formData.knownHistory && (
            <div className="space-y-3">
              <Label>Select vaccines you have completed:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {commonVaccines.map((vaccine) => (
                  <div key={vaccine} className="flex items-center space-x-2">
                    <Checkbox
                      id={vaccine}
                      checked={formData.completedVaccines.includes(vaccine)}
                      onCheckedChange={(checked) => handleVaccineChange(vaccine, checked as boolean)}
                    />
                    <Label htmlFor={vaccine} className="text-sm">{vaccine}</Label>
                  </div>
                ))}
              </div>
              {formData.completedVaccines.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.completedVaccines.map((vaccine) => (
                    <Badge key={vaccine} variant="secondary" className="text-xs">
                      {vaccine}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-medical-warning" />
            Risk Factors
          </CardTitle>
          <CardDescription>
            Select any conditions or circumstances that may require additional vaccinations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {riskFactors.map((factor) => (
              <div key={factor} className="flex items-center space-x-2">
                <Checkbox
                  id={factor}
                  checked={formData.riskFactors.includes(factor)}
                  onCheckedChange={(checked) => handleRiskFactorChange(factor, checked as boolean)}
                />
                <Label htmlFor={factor} className="text-sm">{factor}</Label>
              </div>
            ))}
          </div>
          {formData.riskFactors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.riskFactors.map((factor) => (
                <Badge key={factor} variant="outline" className="text-xs">
                  {factor}
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation (optional)</Label>
            <Select value={formData.occupation} onValueChange={(value) => setFormData(prev => ({ ...prev, occupation: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select your occupation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="healthcare">Healthcare Worker</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="childcare">Childcare</SelectItem>
                <SelectItem value="laboratory">Laboratory Worker</SelectItem>
                <SelectItem value="travel">Frequent Traveler</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        disabled={!formData.age}
      >
        Get Vaccination Recommendations
      </Button>
    </form>
  );
}