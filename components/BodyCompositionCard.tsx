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
  excellent: { label: "최상위", color: "#f97316", bg: "rgba(249,115,22,0.15)", bar: "#f97316" },
  good:      { label: "양호",   color: "#22c55e", bg: "rgba(34,197,94,0.12)",  bar: "#22c55e" },
  average:   { label: "보통",   color: "#3b82f6", bg: "rgba(59,130,246,0.12)", bar: "#3b82f6" },
  below:     { label: "미흡",   color: "#eab308", bg: "rgba(234,179,8,0.12)",  bar: "#eab308" },
  poor:      { label: "부족",   color: "#ef4444", bg: "rgba(239,68,68,0.12)",  bar: "#ef4444" },
};

function PeerComparisonSection({ data }: { data: PeerComparison }) {
  const cfg = (status: keyof typeof STATUS_CONFIG) => STATUS_CONFIG[status] ?? STATUS_CONFIG.average;

  // overall percentile color
  const op = data.overallPercentile;
  const overallColor = op >= 80 ? "#f97316" : op >= 60 ? "#22c55e" : op >= 40 ? "#3b82f6" : op >= 20 ? "#eab308" : "#ef4444";

  return (
    <div style={{ marginTop: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#e2e8f0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span>👥</span> 또래 비교
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 400 }}>
            ({data.gender} · {data.ageGroup} 기준)
          </span>
        </div>

        {/* Overall percentile badge */}
        <div style={{ textAlign: "center", background: `${overallColor}18`, border: `1px solid ${overallColor}35`, borderRadius: "0.75rem", padding: "0.4rem 0.875rem" }}>
          <div style={{ fontSize: "0.65rem", color: "#64748b" }}>종합 순위</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: overallColor, lineHeight: 1.2 }}>
            상위 {100 - op}%
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#64748b", marginBottom: "0.35rem" }}>
          <span>0점 (나쁨)</span>
          <span style={{ color: overallColor, fontWeight: 600 }}>종합 건강점수 {op}점 / 100점</span>
          <span>100점 (최상)</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${op}%`, background: `linear-gradient(90deg, ${overallColor}88, ${overallColor})` }} />
        </div>
        {data.overallComment && (
          <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.5rem", lineHeight: 1.5 }}>
            {data.overallComment}
          </p>
        )}
      </div>

      {/* Per-metric rows */}
      <div style={{ display: "grid", gap: "0.625rem" }}>
        {data.metrics.map((m, i) => {
          const s = cfg(m.status as keyof typeof STATUS_CONFIG);
          const score = Math.min(Math.max(m.healthScore ?? 0, 0), 100);
          const rankLabel = score >= 80 ? `상위 ${100 - score}%` : score >= 50 ? `상위 ${100 - score}%` : `하위 ${100 - score}%`;
          return (
            <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}25`, borderRadius: "0.625rem", padding: "0.75rem 0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0" }}>{m.name}</span>
                  <span style={{ fontSize: "0.65rem", color: s.color, background: `${s.color}20`, border: `1px solid ${s.color}30`, padding: "0.1rem 0.45rem", borderRadius: "999px", fontWeight: 700 }}>
                    {s.label}
                  </span>
                </div>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: s.color }}>
                  건강점수 {score}점
                </span>
              </div>

              {/* bar */}
              <div className="progress-bar" style={{ marginBottom: "0.4rem" }}>
                <div className="progress-fill" style={{ width: `${score}%`, background: s.bar }} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", flexWrap: "wrap", gap: "0.25rem" }}>
                <span style={{ color: "#64748b" }}>
                  나: <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{m.myValue}</span>
                  {m.avgValue && (<>&nbsp;·&nbsp;또래 평균: <span style={{ color: "#94a3b8" }}>{m.avgValue}</span></>)}
                </span>
                <span style={{ color: s.color, fontWeight: 600 }}>{rankLabel}</span>
              </div>
              {m.comment && <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem" }}>{m.comment}</div>}
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
          marginBottom: "0.25rem",
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
