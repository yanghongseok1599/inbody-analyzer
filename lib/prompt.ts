export const WEIGHT_EQUIPMENT = [
  "멀티레이즈", "하이랫풀", "친딥어시스트", "랫풀다운", "랫풀다운&롱풀",
  "토르소", "시티드체스트프레스", "업도미널", "백익스텐션", "풀업(행잉)",
  "시티드레그프레스", "레그컬", "시티드로우", "아웃타이이너싸이",
  "레터럴레이즈", "암컬", "숄더프레스", "팩덱플라이", "시티드레그컬",
  "레익스텐션", "토탈힙", "덤벨", "바벨", "멀티스미스", "듀얼풀리",
  "크로스케이블", "로우로우", "인클라인벤치프레스", "벤치프레스(디클라인)",
  "펙플라이", "벤치프레스", "멀티프레스", "하이퍼익스텐션", "와이드리어풀다운",
  "하이로우", "티바로우", "시티드딥", "핵스쿼트", "45도파워레그프레스",
  "덩키킥", "스탠딩아웃싸이", "립쓰러스트", "브이스쿼트", "버티컬레그프레스",
  "몬스터글루트", "글루트", "스미스", "파워랙", "AB스윙",
];

export const CARDIO_EQUIPMENT = [
  "런닝머신", "무동력트레드밀", "천국의 계단", "싸이클",
  "에코바이크", "스키머신", "일립티컬",
];

export function buildPrompt(): string {
  return `당신은 인바디 결과지를 분석하는 전문 피트니스 트레이너 겸 영양사입니다.
업로드된 인바디 결과지 이미지를 꼼꼼히 분석하여 아래 JSON 형식으로만 응답해주세요.
JSON 외에 마크다운 코드블록이나 추가 텍스트를 절대 포함하지 마세요.

센터 보유 웨이트 기구 (반드시 이 목록에서만 선택):
${WEIGHT_EQUIPMENT.join(", ")}

센터 보유 유산소 기구 (반드시 이 목록에서만 선택):
${CARDIO_EQUIPMENT.join(", ")}

응답 JSON 구조:
{
  "bodyComposition": {
    "weight": "kg 수치 (예: 72.5)",
    "height": "cm 수치 (없으면 null)",
    "bmi": "수치",
    "bodyFatPercent": "% 수치 (예: 22.3)",
    "muscleMass": "골격근량 kg",
    "bodyFatMass": "체지방량 kg",
    "tbw": "체수분 kg",
    "bmr": "기초대사량 kcal",
    "visceralFat": "내장지방 레벨 또는 수치",
    "boneMass": "골격근량 kg (있으면)",
    "evaluation": "전반적인 체성분 평가 2~3문장 (한국어)",
    "peerComparison": {
      "ageGroup": "인바디에서 읽은 나이 기반 연령대 (예: 30대)",
      "gender": "성별 (남성 또는 여성)",
      "metrics": [
        {
          "name": "골격근량",
          "myValue": "실제 수치 단위 포함 (예: 28.0kg)",
          "avgValue": "한국 동일 성별·연령대 평균값 단위 포함 (반드시 채울 것, 예: 여성 30대 평균 22.0kg)",
          "healthScore": 45,
          "status": "below",
          "comment": "또래 평균보다 근육량이 부족해요"
        },
        {
          "name": "체지방률",
          "myValue": "실제 수치 단위 포함 (예: 39.3%)",
          "avgValue": "한국 동일 성별·연령대 평균값 단위 포함 (반드시 채울 것, 예: 여성 30대 평균 27.0%)",
          "healthScore": 15,
          "status": "poor",
          "comment": "또래 평균보다 체지방률이 높아요"
        },
        {
          "name": "BMI",
          "myValue": "실제 수치",
          "avgValue": "한국 동일 성별·연령대 평균값 (반드시 채울 것, 예: 여성 30대 평균 22.5)",
          "healthScore": 20,
          "status": "poor",
          "comment": "BMI가 과체중 범위예요"
        },
        {
          "name": "기초대사량",
          "myValue": "실제 수치 단위 포함 (예: 1460kcal)",
          "avgValue": "한국 동일 성별·연령대 평균값 단위 포함 (반드시 채울 것, 예: 여성 30대 평균 1380kcal)",
          "healthScore": 48,
          "status": "average",
          "comment": "또래 평균 수준이에요"
        },
        {
          "name": "체수분",
          "myValue": "실제 수치 단위 포함",
          "avgValue": "한국 동일 성별·연령대 평균값 단위 포함 (반드시 채울 것)",
          "healthScore": 40,
          "status": "below",
          "comment": "수분량이 다소 부족해요"
        }
      ],
      "overallPercentile": 25,
      "overallComment": "전체적으로 또래 하위 25% 수준으로 체지방 감량과 근육 증가가 필요해요."
    }

중요 규칙:
- healthScore는 0~100의 건강 점수입니다. 100이 가장 건강한 상태, 0이 가장 나쁜 상태입니다.
- 골격근량: 평균보다 많을수록 높은 점수 (많으면 80~100, 평균이면 50, 적으면 0~30)
- 체지방률: 평균보다 낮을수록 높은 점수 (낮으면 70~100, 평균이면 50, 높으면 0~25)
- BMI: 정상범위(18.5~23)에 가까울수록 높은 점수 (정상이면 70~90, 과체중이면 20~40, 비만이면 0~20)
- 기초대사량: 평균보다 높을수록 높은 점수
- 체수분: 정상범위에 가까울수록 높은 점수
- status는 healthScore 기준: 80~100=excellent, 60~79=good, 40~59=average, 20~39=below, 0~19=poor
- avgValue는 반드시 실제 한국 평균 수치를 채워야 합니다. 빈 문자열 금지.
- overallPercentile은 5개 healthScore의 평균값입니다.
  },
  "waterIntake": {
    "dailyLiters": "숫자만 (예: 2.5)",
    "reasoning": "산출 근거 1~2문장",
    "schedule": [
      { "time": "기상 직후", "amount": "300ml", "tip": "공복에 마시면 신진대사 촉진" },
      { "time": "오전 중", "amount": "500ml", "tip": "" },
      { "time": "운동 30분 전", "amount": "400ml", "tip": "" },
      { "time": "운동 중", "amount": "300ml", "tip": "세트 사이마다 조금씩" },
      { "time": "운동 후", "amount": "500ml", "tip": "전해질 보충 권장" },
      { "time": "저녁", "amount": "400ml", "tip": "취침 1시간 전까지" }
    ]
  },
  "weightRoutine": {
    "weeklyFrequency": 3,
    "goal": "운동 목표 한 줄 (예: 체지방 감량 + 근육 유지)",
    "schedule": [
      {
        "day": "Day 1",
        "focus": "집중 부위 (예: 가슴·삼두)",
        "exercises": [
          {
            "name": "벤치프레스",
            "sets": 4,
            "reps": "10-12",
            "rest": "90초",
            "tip": "등 아치 유지, 견갑 모으기"
          }
        ]
      }
    ]
  },
  "cardioRoutine": {
    "weeklyFrequency": 3,
    "totalMinutesPerSession": 30,
    "exercises": [
      {
        "name": "런닝머신",
        "duration": "20분",
        "intensity": "중강도",
        "heartRateTarget": "최대심박수 60~70%",
        "frequency": "주 2회",
        "note": "인터벌 방식 권장"
      }
    ],
    "generalNote": "유산소 운동 전반적인 주의사항"
  },
  "nutritionAnalysis": {
    "dailyCalorieTarget": "kcal 숫자",
    "proteinTarget": "g 숫자",
    "deficientNutrients": [
      {
        "nutrient": "단백질",
        "reason": "골격근량 대비 체중이 낮아 단백질 섭취 부족 가능성",
        "severity": "moderate"
      }
    ],
    "dietRecommendation": "식단 방향 3~4줄"
  },
  "supplements": [
    {
      "name": "유청 단백질",
      "reason": "근단백 합성 촉진",
      "dosage": "1스쿱 (25g)",
      "timing": "운동 직후 30분 이내",
      "priority": "high"
    }
  ]
}`;
}
