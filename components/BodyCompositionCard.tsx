"use client";

import type { BodyComposition, PeerComparison } from "@/lib/types";

interface MetricProps {
  label: string;
  value: string;
  unit?: string;
  color?: string;
}

function Metric({ label, value, unit, color = "#f97316" }: MetricProps) {
  return (
    <div style={{ background: "rgba(30,45,69,0.4)", borderRadius: "0.625rem", padding: "0.875rem" }}>
      <div className="metric-label">{label}</div>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="metric-value" style={{ color }}>{value}</span>
        {unit && <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{unit}</span>}
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  excellent: { label: "최상위 🏆", color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.35)", bar: "linear-gradient(90deg,#f97316,#fb923c)", emoji: "🔥" },
  good:      { label: "양호 👍",   color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)",  bar: "linear-gradient(90deg,#16a34a,#22c55e)", emoji: "✅" },
  average:   { label: "보통",      color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)", bar: "linear-gradient(90deg,#2563eb,#3b82f6)", emoji: "➡️" },
  below:     { label: "미흡 ⚠️",   color: "#eab308", bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.35)", bar: "linear-gradient(90deg,#ca8a04,#eab308)", emoji: "⚠️" },
  poor:      { label: "위험 🚨",   color: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.4)",  bar: "linear-gradient(90deg,#b91c1c,#ef4444)", emoji: "🚨" },
};

const OVERALL_GRADE = [
  { min: 80, label: "매우 우수",  color: "#f97316", alert: null },
  { min: 60, label: "양호",       color: "#22c55e", alert: null },
  { min: 40, label: "보통",       color: "#3b82f6", alert: "체성분 개선이 필요합니다." },
  { min: 20, label: "미흡",       color: "#eab308", alert: "적극적인 관리가 필요한 상태입니다!" },
  { min: 0,  label: "위험",       color: "#ef4444", alert: "즉각적인 체성분 개선이 필요한 위험 상태입니다!" },
];

function getGrade(score: number) {
  return OVERALL_GRADE.find(g => score >= g.min) ?? OVERALL_GRADE[OVERALL_GRADE.length - 1];
}

function PeerComparisonSection({ data }: { data: PeerComparison }) {
  const cfg = (status: keyof typeof STATUS_CONFIG) => STATUS_CONFIG[status] ?? STATUS_CONFIG.average;
  const op = Math.min(Math.max(data.overallPercentile ?? 50, 0), 100);
  const grade = getGrade(op);

  return (
    <div style={{ marginTop: "1.5rem" }}>
      {/* 섹션 구분선 */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #1e2d45, transparent)", marginBottom: "1.5rem" }} />

      {/* 헤더 */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <span>👥</span> 또래 비교
          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 400 }}>
            {data.gender} · {data.ageGroup} 기준
          </span>
        </div>
      </div>

      {/* 종합 점수 대형 카드 */}
      <div style={{
        background: `${grade.color}12`,
        border: `2px solid ${grade.color}50`,
        borderRadius: "1rem",
        padding: "1.25rem 1.5rem",
        marginBottom: "1.25rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 배경 글로우 */}
        <div style={{
          position: "absolute", top: "-30px", right: "-30px",
          width: "120px", height: "120px",
          background: `radial-gradient(circle, ${grade.color}25, transparent 70%)`,
          borderRadius: "50%",
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>종합 건강 점수</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={{ fontSize: "3rem", fontWeight: 900, color: grade.color, lineHeight: 1 }}>{op}</span>
              <span style={{ fontSize: "1.25rem", color: "#64748b" }}>/ 100</span>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.3rem",
              marginTop: "0.4rem",
              background: `${grade.color}20`, border: `1px solid ${grade.color}40`,
              borderRadius: "999px", padding: "0.25rem 0.75rem",
              fontSize: "0.8rem", fontWeight: 700, color: grade.color,
            }}>
              {grade.label}
            </div>
          </div>

          {/* 원형 게이지 */}
          <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
            <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="32" fill="none"
                stroke={grade.color} strokeWidth="8"
                strokeDasharray={`${(op / 100) * 201} 201`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              fontSize: "0.65rem", color: "#94a3b8", textAlign: "center", lineHeight: 1.3,
            }}>
              <span style={{ fontSize: "1rem", fontWeight: 800, color: grade.color }}>{op >= 50 ? `상위${100 - op}%` : `하위${100-op}%`}</span>
            </div>
          </div>
        </div>

        {/* 전체 바 */}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "#475569", marginBottom: "0.3rem" }}>
            <span>0 (나쁨)</span><span>50 (평균)</span><span>100 (최상)</span>
          </div>
          <div style={{ height: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
            {/* 평균선 */}
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", background: "rgba(255,255,255,0.2)" }} />
            <div style={{
              height: "100%", borderRadius: "999px",
              background: `linear-gradient(90deg, ${grade.color}60, ${grade.color})`,
              width: `${op}%`,
              transition: "width 1.2s ease",
            }} />
          </div>
        </div>

        {/* 경고 메시지 */}
        {grade.alert && (
          <div style={{
            marginTop: "0.875rem",
            padding: "0.625rem 0.875rem",
            background: `${grade.color}15`,
            border: `1px solid ${grade.color}30`,
            borderRadius: "0.5rem",
            fontSize: "0.82rem", color: grade.color, fontWeight: 600,
          }}>
            ⚠️ {grade.alert}
          </div>
        )}

        {data.overallComment && (
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.625rem", lineHeight: 1.6 }}>
            {data.overallComment}
          </p>
        )}
      </div>

      {/* 항목별 카드 */}
      <div style={{ display: "grid", gap: "0.625rem" }}>
        {data.metrics.map((m, i) => {
          const s = cfg(m.status as keyof typeof STATUS_CONFIG);
          const score = Math.min(Math.max(m.healthScore ?? 0, 0), 100);
          const rankLabel = score >= 50 ? `상위 ${100 - score}%` : `하위 ${100 - score}%`;

          return (
            <div key={i} style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: "0.75rem",
              padding: "0.875rem 1rem",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* 왼쪽 강조 바 */}
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: "3px", background: s.bar, borderRadius: "999px 0 0 999px",
              }} />

              <div style={{ paddingLeft: "0.5rem" }}>
                {/* 상단 행 */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1rem" }}>{s.emoji}</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#e2e8f0" }}>{m.name}</span>
                    <span style={{
                      fontSize: "0.65rem", color: s.color,
                      background: `${s.color}20`, border: `1px solid ${s.color}35`,
                      padding: "0.15rem 0.5rem", borderRadius: "999px", fontWeight: 700,
                    }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 900, color: s.color, lineHeight: 1 }}>{score}점</div>
                    <div style={{ fontSize: "0.65rem", color: s.color, opacity: 0.8 }}>{rankLabel}</div>
                  </div>
                </div>

                {/* 진행 바 */}
                <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: "0.5rem", position: "relative" }}>
                  <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.15)" }} />
                  <div style={{ height: "100%", borderRadius: "999px", background: s.bar, width: `${score}%`, transition: "width 1s ease" }} />
                </div>

                {/* 수치 비교 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.25rem" }}>
                  <div style={{ fontSize: "0.75rem" }}>
                    <span style={{ color: "#64748b" }}>내 수치 </span>
                    <span style={{ color: "#e2e8f0", fontWeight: 700 }}>{m.myValue}</span>
                    {m.avgValue && (
                      <>
                        <span style={{ color: "#334155", margin: "0 0.4rem" }}>|</span>
                        <span style={{ color: "#64748b" }}>또래 평균 </span>
                        <span style={{ color: "#94a3b8", fontWeight: 600 }}>{m.avgValue}</span>
                      </>
                    )}
                  </div>
                  {m.comment && (
                    <span style={{ fontSize: "0.72rem", color: s.color, fontStyle: "italic" }}>{m.comment}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BodyCompositionCard({ data }: { data: BodyComposition }) {
  const bmi = parseFloat(data.bmi);
  const fatPct = parseFloat(data.bodyFatPercent);

  const bmiColor = bmi < 18.5 ? "#3b82f6" : bmi < 25 ? "#22c55e" : bmi < 30 ? "#eab308" : "#ef4444";
  const fatColor = fatPct < 15 ? "#3b82f6" : fatPct < 25 ? "#22c55e" : fatPct < 30 ? "#eab308" : "#ef4444";

  return (
    <div className="card fade-in">
      <div className="section-title">
        <span>📊</span> 체성분 분석 결과
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <Metric label="체중" value={data.weight} unit="kg" />
        {data.height && <Metric label="신장" value={data.height} unit="cm" color="#e2e8f0" />}
        <Metric label="BMI" value={data.bmi} color={bmiColor} />
        <Metric label="체지방률" value={data.bodyFatPercent} unit="%" color={fatColor} />
        <Metric label="골격근량" value={data.muscleMass} unit="kg" color="#22c55e" />
        <Metric label="체지방량" value={data.bodyFatMass} unit="kg" color="#ef4444" />
        <Metric label="체수분" value={data.tbw} unit="kg" color="#3b82f6" />
        <Metric label="기초대사량" value={data.bmr} unit="kcal" color="#a855f7" />
        {data.visceralFat && <Metric label="내장지방" value={data.visceralFat} color="#eab308" />}
      </div>

      {data.evaluation && (
        <div style={{
          background: "rgba(249,115,22,0.08)",
          border: "1px solid rgba(249,115,22,0.2)",
          borderRadius: "0.75rem",
          padding: "1rem",
        }}>
          <div style={{ fontSize: "0.75rem", color: "#f97316", fontWeight: 600, marginBottom: "0.5rem" }}>
            💡 종합 평가
          </div>
          <p style={{ color: "#cbd5e1", lineHeight: 1.7, fontSize: "0.9rem" }}>{data.evaluation}</p>
        </div>
      )}

      {data.peerComparison && <PeerComparisonSection data={data.peerComparison} />}
    </div>
  );
}
