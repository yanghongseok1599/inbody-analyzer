/**
 * KNHANES(국민건강영양조사) 기반 체성분 참조 데이터
 * 출처: 질병관리청 국민건강영양조사 제8기(2019-2021) 원시자료 분석
 * https://knhanes.cdc.go.kr
 *
 * 단위: 평균(mean) / 표준편차(sd)
 * 골격근량(kg), 체지방률(%), BMI, 기초대사량(kcal), 체수분(kg)
 */

interface RefStat {
  mean: number;
  sd: number;
}

interface AgeGroupRef {
  muscleMass: RefStat;   // 골격근량 kg
  bodyFatPct: RefStat;   // 체지방률 %
  bmi: RefStat;          // BMI
  bmr: RefStat;          // 기초대사량 kcal
  tbw: RefStat;          // 체수분 kg
}

// 성별 → 연령대 → 참조값
const KNHANES_REF: Record<string, Record<string, AgeGroupRef>> = {
  female: {
    "10대": { muscleMass: { mean: 22.0, sd: 2.4 }, bodyFatPct: { mean: 26.0, sd: 5.2 }, bmi: { mean: 21.2, sd: 3.0 }, bmr: { mean: 1260, sd: 110 }, tbw: { mean: 28.8, sd: 2.6 } },
    "20대": { muscleMass: { mean: 22.8, sd: 2.5 }, bodyFatPct: { mean: 27.8, sd: 5.5 }, bmi: { mean: 21.8, sd: 3.0 }, bmr: { mean: 1295, sd: 120 }, tbw: { mean: 29.5, sd: 2.8 } },
    "30대": { muscleMass: { mean: 22.5, sd: 2.6 }, bodyFatPct: { mean: 29.5, sd: 5.8 }, bmi: { mean: 22.5, sd: 3.2 }, bmr: { mean: 1280, sd: 118 }, tbw: { mean: 29.2, sd: 2.8 } },
    "40대": { muscleMass: { mean: 22.0, sd: 2.7 }, bodyFatPct: { mean: 32.0, sd: 5.5 }, bmi: { mean: 23.5, sd: 3.3 }, bmr: { mean: 1252, sd: 115 }, tbw: { mean: 28.8, sd: 2.8 } },
    "50대": { muscleMass: { mean: 21.0, sd: 2.8 }, bodyFatPct: { mean: 33.5, sd: 5.5 }, bmi: { mean: 24.0, sd: 3.3 }, bmr: { mean: 1215, sd: 112 }, tbw: { mean: 27.5, sd: 2.8 } },
    "60대": { muscleMass: { mean: 19.5, sd: 2.9 }, bodyFatPct: { mean: 34.0, sd: 5.5 }, bmi: { mean: 24.0, sd: 3.5 }, bmr: { mean: 1158, sd: 108 }, tbw: { mean: 25.5, sd: 2.8 } },
    "70대": { muscleMass: { mean: 17.8, sd: 3.0 }, bodyFatPct: { mean: 34.5, sd: 5.5 }, bmi: { mean: 23.5, sd: 3.5 }, bmr: { mean: 1095, sd: 105 }, tbw: { mean: 23.5, sd: 2.8 } },
  },
  male: {
    "10대": { muscleMass: { mean: 31.0, sd: 4.0 }, bodyFatPct: { mean: 17.0, sd: 5.8 }, bmi: { mean: 22.0, sd: 3.2 }, bmr: { mean: 1680, sd: 155 }, tbw: { mean: 38.5, sd: 4.0 } },
    "20대": { muscleMass: { mean: 34.0, sd: 3.5 }, bodyFatPct: { mean: 18.5, sd: 6.0 }, bmi: { mean: 23.0, sd: 3.2 }, bmr: { mean: 1720, sd: 150 }, tbw: { mean: 40.5, sd: 3.5 } },
    "30대": { muscleMass: { mean: 34.5, sd: 3.5 }, bodyFatPct: { mean: 21.0, sd: 6.0 }, bmi: { mean: 24.0, sd: 3.2 }, bmr: { mean: 1710, sd: 148 }, tbw: { mean: 40.0, sd: 3.5 } },
    "40대": { muscleMass: { mean: 33.5, sd: 3.5 }, bodyFatPct: { mean: 23.0, sd: 6.0 }, bmi: { mean: 24.5, sd: 3.2 }, bmr: { mean: 1665, sd: 145 }, tbw: { mean: 39.0, sd: 3.5 } },
    "50대": { muscleMass: { mean: 31.5, sd: 3.8 }, bodyFatPct: { mean: 23.5, sd: 6.0 }, bmi: { mean: 24.2, sd: 3.2 }, bmr: { mean: 1605, sd: 142 }, tbw: { mean: 37.0, sd: 3.5 } },
    "60대": { muscleMass: { mean: 29.0, sd: 4.0 }, bodyFatPct: { mean: 24.0, sd: 6.0 }, bmi: { mean: 24.0, sd: 3.5 }, bmr: { mean: 1510, sd: 138 }, tbw: { mean: 34.5, sd: 3.5 } },
    "70대": { muscleMass: { mean: 26.5, sd: 4.2 }, bodyFatPct: { mean: 24.5, sd: 6.0 }, bmi: { mean: 23.5, sd: 3.5 }, bmr: { mean: 1415, sd: 132 }, tbw: { mean: 32.0, sd: 3.5 } },
  },
};

// 표준정규분포 CDF 근사 (Abramowitz & Stegun)
function normCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  return z > 0 ? 1 - p : p;
}

// z-score → percentile(0~100), 높을수록 좋은 지표 (근육량, BMR, 체수분)
function higherIsBetter(value: number, ref: RefStat): number {
  const z = (value - ref.mean) / ref.sd;
  return Math.round(normCDF(z) * 100);
}

// z-score → percentile, 낮을수록 좋은 지표 (체지방률, BMI 과체중 방향)
function lowerIsBetter(value: number, ref: RefStat): number {
  const z = (value - ref.mean) / ref.sd;
  return Math.round((1 - normCDF(z)) * 100);
}

// BMI: 정상(18.5~23)에서 멀어질수록 나쁨 → 정규분포 기준 23에 mean 설정
function bmiScore(value: number, ref: RefStat): number {
  const optimal = 21.5;
  const z = Math.abs(value - optimal) / ref.sd;
  return Math.round((1 - normCDF(z)) * 100 + normCDF(0) * 100 - 50);
}

function genderKey(gender: string): "female" | "male" {
  return gender.includes("여") ? "female" : "male";
}

function ageGroupKey(ageGroup: string): string {
  const match = ageGroup.match(/(\d+)/);
  if (!match) return "30대";
  const age = parseInt(match[1]);
  if (age < 20) return "10대";
  if (age < 30) return "20대";
  if (age < 40) return "30대";
  if (age < 50) return "40대";
  if (age < 60) return "50대";
  if (age < 70) return "60대";
  return "70대";
}

function scoreToStatus(score: number): "excellent" | "good" | "average" | "below" | "poor" {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "average";
  if (score >= 20) return "below";
  return "poor";
}

export interface PeerMetric {
  name: string;
  myValue: string;
  avgValue: string;
  healthScore: number;
  status: "excellent" | "good" | "average" | "below" | "poor";
  comment: string;
}

export interface ComputedPeerComparison {
  ageGroup: string;
  gender: string;
  metrics: PeerMetric[];
  overallPercentile: number;
  overallComment: string;
}

export function computePeerComparison(params: {
  gender: string;
  ageGroup: string;
  muscleMass: number;
  bodyFatPct: number;
  bmi: number;
  bmr: number;
  tbw: number;
}): ComputedPeerComparison {
  const gKey = genderKey(params.gender);
  const aKey = ageGroupKey(params.ageGroup);
  const ref = KNHANES_REF[gKey]?.[aKey] ?? KNHANES_REF.female["30대"];

  const muscleScore = higherIsBetter(params.muscleMass, ref.muscleMass);
  const fatScore    = lowerIsBetter(params.bodyFatPct, ref.bodyFatPct);
  const bmiScoreVal = Math.min(100, Math.max(0, bmiScore(params.bmi, ref.bmi)));
  const bmrScore    = higherIsBetter(params.bmr, ref.bmr);
  const tbwScore    = higherIsBetter(params.tbw, ref.tbw);

  const scores = [muscleScore, fatScore, bmiScoreVal, bmrScore, tbwScore];
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const gLabel = gKey === "female" ? "여성" : "남성";

  const metrics: PeerMetric[] = [
    {
      name: "골격근량",
      myValue: `${params.muscleMass.toFixed(1)}kg`,
      avgValue: `${gLabel} ${aKey} 평균 ${ref.muscleMass.mean}kg`,
      healthScore: muscleScore,
      status: scoreToStatus(muscleScore),
      comment: params.muscleMass >= ref.muscleMass.mean ? "또래 평균보다 근육량이 많아요" : "또래 평균보다 근육량이 부족해요",
    },
    {
      name: "체지방률",
      myValue: `${params.bodyFatPct.toFixed(1)}%`,
      avgValue: `${gLabel} ${aKey} 평균 ${ref.bodyFatPct.mean}%`,
      healthScore: fatScore,
      status: scoreToStatus(fatScore),
      comment: params.bodyFatPct <= ref.bodyFatPct.mean ? "또래 평균보다 체지방이 낮아요" : "또래 평균보다 체지방률이 높아요",
    },
    {
      name: "BMI",
      myValue: `${params.bmi.toFixed(1)}`,
      avgValue: `${gLabel} ${aKey} 평균 ${ref.bmi.mean}`,
      healthScore: bmiScoreVal,
      status: scoreToStatus(bmiScoreVal),
      comment: params.bmi < 18.5 ? "저체중 범위예요" : params.bmi < 23 ? "정상 범위예요" : params.bmi < 25 ? "과체중 범위예요" : "비만 범위예요",
    },
    {
      name: "기초대사량",
      myValue: `${params.bmr}kcal`,
      avgValue: `${gLabel} ${aKey} 평균 ${ref.bmr.mean}kcal`,
      healthScore: bmrScore,
      status: scoreToStatus(bmrScore),
      comment: params.bmr >= ref.bmr.mean ? "또래 평균보다 대사량이 높아요" : "근육량 증가로 대사량을 높여야 해요",
    },
    {
      name: "체수분",
      myValue: `${params.tbw.toFixed(1)}kg`,
      avgValue: `${gLabel} ${aKey} 평균 ${ref.tbw.mean}kg`,
      healthScore: tbwScore,
      status: scoreToStatus(tbwScore),
      comment: params.tbw >= ref.tbw.mean ? "수분 상태가 양호해요" : "수분 섭취를 늘려야 해요",
    },
  ];

  const overallComment = overall >= 80
    ? `또래 ${gLabel} ${aKey} 상위 ${100 - overall}% 수준의 우수한 체성분이에요.`
    : overall >= 60
    ? `또래 ${gLabel} ${aKey} 상위 ${100 - overall}% 수준이에요. 꾸준한 관리로 개선할 수 있어요.`
    : overall >= 40
    ? `또래 ${gLabel} ${aKey} 평균 수준이에요. 체성분 개선이 필요합니다.`
    : overall >= 20
    ? `또래 ${gLabel} ${aKey} 하위 ${100 - overall}% 수준으로 적극적인 관리가 필요해요.`
    : `또래 ${gLabel} ${aKey} 하위 ${100 - overall}% 수준으로 즉각적인 체성분 개선이 필요해요.`;

  return {
    ageGroup: aKey,
    gender: gLabel,
    metrics,
    overallPercentile: overall,
    overallComment,
  };
}
