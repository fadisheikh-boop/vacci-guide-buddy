import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Clock, Info, ArrowLeft } from 'lucide-react';

interface VaccinationData {
  age: string;
  knownHistory: boolean;
  completedVaccines: string[];
  riskFactors: string[];
  occupation: string;
}

interface VaccineRec {
  vaccine: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  ageRange?: string;
  notes?: string;
}

interface VaccinationResultsProps {
  data: VaccinationData;
  onBack: () => void;
}

// Vaccination recommendation logic based on ACIP guidelines
const getVaccinationRecommendations = (data: VaccinationData): VaccineRec[] => {
  const recommendations: VaccineRec[] = [];
  const age = parseInt(data.age);
  const { completedVaccines, riskFactors, knownHistory } = data;

  // Helper function to check if vaccine is completed
  const isCompleted = (vaccine: string) => 
    completedVaccines.some(v => v.toLowerCase().includes(vaccine.toLowerCase()));

  // Age-based recommendations
  if (age >= 65) {
    if (!isCompleted('pneumococcal')) {
      recommendations.push({
        vaccine: 'Pneumococcal (PPSV23 and PCV13)',
        priority: 'high',
        reason: 'Recommended for all adults 65 and older',
        ageRange: '65+',
        notes: 'Protects against pneumonia and other serious infections'
      });
    }
    
    if (!isCompleted('shingles')) {
      recommendations.push({
        vaccine: 'Shingles (Zoster)',
        priority: 'high',
        reason: 'Recommended for all adults 60 and older',
        ageRange: '60+',
        notes: 'Two doses, 2-6 months apart'
      });
    }
  }

  // Tdap/DTaP - every 10 years
  if (!isCompleted('dtap') && !isCompleted('tdap')) {
    recommendations.push({
      vaccine: 'Tdap (Tetanus, Diphtheria, Pertussis)',
      priority: 'high',
      reason: 'Required every 10 years for all adults',
      notes: 'Protects against tetanus, diphtheria, and whooping cough'
    });
  }

  // HPV for younger adults
  if (age <= 26 && !isCompleted('hpv')) {
    recommendations.push({
      vaccine: 'HPV (Human Papillomavirus)',
      priority: 'high',
      reason: 'Recommended for adults up to age 26',
      ageRange: '9-26',
      notes: 'Protects against cancer-causing HPV'
    });
  }

  // MMR for adults without history
  if (!isCompleted('mmr') && (age < 65 || !knownHistory)) {
    recommendations.push({
      vaccine: 'MMR (Measles, Mumps, Rubella)',
      priority: 'medium',
      reason: 'Recommended for adults without evidence of immunity',
      notes: 'Especially important for international travel'
    });
  }

  // Hepatitis B for adults without vaccination
  if (!isCompleted('hepatitis b')) {
    recommendations.push({
      vaccine: 'Hepatitis B',
      priority: 'medium',
      reason: 'Recommended for all unvaccinated adults',
      notes: 'Three-dose series'
    });
  }

  // Annual vaccines
  if (!isCompleted('influenza')) {
    recommendations.push({
      vaccine: 'Influenza (Flu)',
      priority: 'high',
      reason: 'Recommended annually for all adults',
      notes: 'Get updated vaccine each year'
    });
  }

  if (!isCompleted('covid-19')) {
    recommendations.push({
      vaccine: 'COVID-19',
      priority: 'high',
      reason: 'Stay up to date with COVID-19 vaccination',
      notes: 'Follow current CDC recommendations for boosters'
    });
  }

  // Risk factor based recommendations
  if (riskFactors.includes('Immunocompromised') || riskFactors.includes('Chronic heart disease') || 
      riskFactors.includes('Chronic lung disease') || riskFactors.includes('Diabetes')) {
    if (!isCompleted('pneumococcal') && age < 65) {
      recommendations.push({
        vaccine: 'Pneumococcal',
        priority: 'high',
        reason: 'Recommended due to high-risk medical conditions',
        notes: 'Important protection against serious bacterial infections'
      });
    }
  }

  if (riskFactors.includes('Healthcare worker')) {
    if (!isCompleted('hepatitis b')) {
      recommendations.push({
        vaccine: 'Hepatitis B',
        priority: 'high',
        reason: 'Required for healthcare workers',
        notes: 'Occupational exposure protection'
      });
    }
    if (!isCompleted('varicella')) {
      recommendations.push({
        vaccine: 'Varicella (Chickenpox)',
        priority: 'high',
        reason: 'Required for healthcare workers without immunity',
        notes: 'Two doses if no history of chickenpox'
      });
    }
  }

  if (riskFactors.includes('International travel')) {
    if (!isCompleted('hepatitis a')) {
      recommendations.push({
        vaccine: 'Hepatitis A',
        priority: 'medium',
        reason: 'Recommended for international travelers',
        notes: 'Two doses, 6-12 months apart'
      });
    }
  }

  if (riskFactors.includes('College student')) {
    if (!isCompleted('meningococcal')) {
      recommendations.push({
        vaccine: 'Meningococcal',
        priority: 'high',
        reason: 'Recommended for college students',
        ageRange: '16-23',
        notes: 'Protects against meningitis'
      });
    }
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

export default function VaccinationResults({ data, onBack }: VaccinationResultsProps) {
  const recommendations = getVaccinationRecommendations(data);
  const highPriority = recommendations.filter(r => r.priority === 'high');
  const mediumPriority = recommendations.filter(r => r.priority === 'medium');
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Form
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Vaccination Recommendations</h2>
          <p className="text-muted-foreground">Based on ACIP guidelines and your profile</p>
        </div>
      </div>

      {/* Summary Alert */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Assessment Complete</AlertTitle>
        <AlertDescription>
          Based on your age ({data.age} years), vaccination history, and risk factors, 
          we found {recommendations.length} vaccination recommendations for you.
        </AlertDescription>
      </Alert>

      {/* High Priority Vaccines */}
      {highPriority.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              High Priority Vaccines
            </CardTitle>
            <CardDescription>
              These vaccines are strongly recommended for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {highPriority.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getPriorityIcon(rec.priority)}
                      <h3 className="font-semibold text-foreground">{rec.vaccine}</h3>
                      {rec.ageRange && (
                        <Badge variant="outline" className="text-xs">
                          Age {rec.ageRange}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                    {rec.notes && (
                      <p className="text-xs text-muted-foreground italic">{rec.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Medium Priority Vaccines */}
      {mediumPriority.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Clock className="w-5 h-5" />
              Consider These Vaccines
            </CardTitle>
            <CardDescription>
              These vaccines may be beneficial based on your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mediumPriority.map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getPriorityIcon(rec.priority)}
                      <h3 className="font-semibold text-foreground">{rec.vaccine}</h3>
                      {rec.ageRange && (
                        <Badge variant="outline" className="text-xs">
                          Age {rec.ageRange}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.reason}</p>
                    {rec.notes && (
                      <p className="text-xs text-muted-foreground italic">{rec.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Recommendations */}
      {recommendations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-medical-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
            <p className="text-muted-foreground">
              Based on your vaccination history and current guidelines, 
              you appear to be up to date with recommended vaccines.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Important Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          These recommendations are based on general ACIP guidelines. Please consult with your healthcare 
          provider to discuss your specific vaccination needs and to verify your vaccination records.
          This tool is for informational purposes only and should not replace professional medical advice.
        </AlertDescription>
      </Alert>
    </div>
  );
}