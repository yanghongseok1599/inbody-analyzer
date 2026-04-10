export interface PeerComparison {
  ageGroup: string;
  gender: string;
  metrics: {
    name: string;
    myValue: string;
    avgValue: string;
    healthScore: number;
    status: "excellent" | "good" | "average" | "below" | "poor";
    comment: string;
  }[];
  overallPercentile: number;
  overallComment: string;
}

export interface BodyComposition {
  weight: string;
  height: string | null;
  bmi: string;
  bodyFatPercent: string;
  muscleMass: string;
  bodyFatMass: string;
  tbw: string;
  bmr: string;
  visceralFat: string;
  boneMass: string;
  evaluation: string;
  peerComparison: PeerComparison;
}

export interface WaterScheduleItem {
  time: string;
  amount: string;
  tip: string;
}

export interface WaterIntake {
  dailyLiters: string;
  reasoning: string;
  schedule: WaterScheduleItem[];
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  tip: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WeightRoutine {
  weeklyFrequency: number;
  goal: string;
  schedule: WorkoutDay[];
}

export interface CardioExercise {
  name: string;
  duration: string;
  intensity: string;
  heartRateTarget: string;
  frequency: string;
  note: string;
}

export interface CardioRoutine {
  weeklyFrequency: number;
  totalMinutesPerSession: number;
  exercises: CardioExercise[];
  generalNote: string;
}

export interface DeficientNutrient {
  nutrient: string;
  reason: string;
  severity: "mild" | "moderate" | "severe";
}

export interface NutritionAnalysis {
  dailyCalorieTarget: string;
  proteinTarget: string;
  deficientNutrients: DeficientNutrient[];
  dietRecommendation: string;
}

export interface Supplement {
  name: string;
  reason: string;
  dosage: string;
  timing: string;
  priority: "high" | "medium" | "low";
}

export interface AnalysisResult {
  bodyComposition: BodyComposition;
  waterIntake: WaterIntake;
  weightRoutine: WeightRoutine;
  cardioRoutine: CardioRoutine;
  nutritionAnalysis: NutritionAnalysis;
  supplements: Supplement[];
}
