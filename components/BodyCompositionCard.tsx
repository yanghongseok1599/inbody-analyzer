"use client";

import type { BodyComposition, PeerComparison } from "@/lib/types";

function Metric({ label, value, unit, color = "#f97316" }: { label: string; value: string; unit?: string; color?: string }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.75rem", padding: "0.875rem" }}>
      <div className="metric-label">{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginTop: "0.25rem" }}>
        <span className="metric-value" style={{ color }}>{value}</span>
        {unit && <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{unit}</span>}
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  excellent: { label: "최상위 🏆", color: "#ea580c", bg: "#fff7ed", border: "#fed7aa", bar: "linear-gradient(90deg,#f97316,#fb923c)", emoji: "🔥" },
  good:      { label: "양호 👍",   color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", bar: "linear-gradient(90deg,#1d4ed8,#3b82f6)", emoji: "✅" },
  average:   { label: "보통",      color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd", bar: "linear-gradient(90deg,#0284c7,#38bdf8)", emoji: "➡️" },
  below:     { label: "미흡 ⚠️",   color: "#d97706", bg: "#fffbeb", border: "#fde68a", bar: "linear-gradient(90deg,#b45309,#f59e0b)", emoji: "⚠️" },
  poor:      { label: "위험 🚨",   color: "#dc2626", bg: "#fef2f2", border: "#fecaca", bar: "linear-gradient(90deg,#b91c1c,#ef4444)", emoji: "🚨" },
};

const GRADES = [
  { min: 80, label: "매우 우수",  color: "#ea580c", alert: null },
  { min: 60, label: "양호",       color: "#2563eb", alert: null },
  { min: 40, label: "보통",       color: "#0369a1", alert: "체성분 개선이 필요합니다." },
  { min: 20, label: "미흡",       color: "#d97706", alert: "적극적인 관리가 필요한 상태입니다!" },
  { min: 0,  label: "위험",       color: "#dc2626", alert: "즉각적인 체성분 개선이 필요한 상태입니다!" },
];

function getGrade(score: number) {
  return GRADES.find(g => score >= g.min) ?? GRADES[GRADES.length - 1];
}

function PeerSection({ data }: { data: PeerComparison }) {
  const cfg = (s: keyof typeof STATUS_CONFIG) => STATUS_CONFIG[s] ?? STATUS_CONFIG.average;
  const op = Math.min(Math.max(data.overallPercentile ?? 50, 0), 100);
  const grade = getGrade(op);

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div className="divider" />
      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <span>👥</span> 또래 비교
        <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 400 }}>{data.gender} · {data.ageGroup} 기준</span>
      </div>

      {/* 종합 점수 카드 */}
      <div style={{
        background: grade.color === "#ea580c" ? "#fff7ed" : grade.color === "#2563eb" ? "#eff6ff" : grade.color === "#0369a1" ? "#f0f9ff" : grade.color === "#d97706" ? "#fffbeb" : "#fef2f2",
        border: `2px solid ${grade.color}30`,
        borderRadius: "1rem",
        padding: "1.25rem 1.5rem",
        marginBottom: "1rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", background: `radial-gradient(circle, ${grade.color}15, transparent 70%)`, borderRadius: "50%" }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "0.25rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>종합 건강 점수</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
              <span style={{ fontSize: "3.5rem", fontWeight: 900, color: grade.color, lineHeight: 1 }}>{op}</span>
              <span style={{ fontSize: "1.1rem", color: "#94a3b8", fontWeight: 600 }}>/ 100</span>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center",
              marginTop: "0.5rem",
              background: `${grade.color}15`, border: `1px solid ${grade.color}35`,
              borderRadius: "999px", padding: "0.25rem 0.875rem",
              fontSize: "0.8rem", fontWeight: 700, color: grade.color,
            }}>{grade.label}</div>
          </div>

          {/* SVG 원형 게이지 */}
          <div style={{ position: "relative", width: "84px", height: "84px", flexShrink: 0 }}>
            <svg width="84" height="84" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="42" cy="42" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle cx="42" cy="42" r="34" fill="none" stroke={grade.color} strokeWidth="8"
                strokeDasharray={`${(op / 100) * 213.6} 213.6`} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 800, color: grade.color, textAlign: "center", lineHeight: 1.2 }}>
                {op >= 50 ? `상위\n${100-op}%` : `하위\n${100-op}%`}
              </span>
            </div>
          </div>
        </div>

        {/* 바 */}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "#94a3b8", marginBottom: "0.3rem" }}>
            <span>0 (나쁨)</span><span>50 (평균)</span><span>100 (최상)</span>
          </div>
          <div style={{ height: "10px", borderRadius: "999px", background: "#e2e8f0", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", background: "#cbd5e1" }} />
            <div style={{ height: "100%", borderRadius: "999px", background: `linear-gradient(90deg, ${grade.color}80, ${grade.color})`, width: `${op}%`, transition: "width 1.2s ease" }} />
          </div>
        </div>

        {grade.alert && (
          <div style={{ marginTop: "0.875rem", padding: "0.625rem 0.875rem", background: `${grade.color}10`, border: `1px solid ${grade.color}25`, borderRadius: "0.5rem", fontSize: "0.82rem", color: grade.color, fontWeight: 600 }}>
            ⚠️ {grade.alert}
          </div>
        )}
        {data.overallComment && (
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.625rem", lineHeight: 1.6 }}>{data.overallComment}</p>
        )}
      </div>

      {/* 항목별 */}
      <div style={{ display: "grid", gap: "0.625rem" }}>
        {data.metrics.map((m, i) => {
          const s = cfg(m.status as keyof typeof STATUS_CONFIG);
          const score = Math.min(Math.max(m.healthScore ?? 0, 0), 100);
          const rankLabel = score >= 50 ? `상위 ${100 - score}%` : `하위 ${100 - score}%`;
          return (
            <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "0.75rem", padding: "0.875rem 1rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: s.bar, borderRadius: "4px 0 0 4px" }} />
              <div style={{ paddingLeft: "0.625rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1rem" }}>{s.emoji}</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>{m.name}</span>
                    <span style={{ fontSize: "0.65rem", color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}30`, padding: "0.15rem 0.5rem", borderRadius: "999px", fontWeight: 700 }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.15rem", fontWeight: 900, color: s.color, lineHeight: 1 }}>{score}점</div>
                    <div style={{ fontSize: "0.65rem", color: s.color, fontWeight: 600 }}>{rankLabel}</div>
                  </div>
                </div>
                <div style={{ height: "8px", borderRadius: "999px", background: "#e2e8f0", overflow: "hidden", marginBottom: "0.5rem", position: "relative" }}>
                  <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "#cbd5e1" }} />
                  <div style={{ height: "100%", borderRadius: "999px", background: s.bar, width: `${score}%`, transition: "width 1s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.25rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    내 수치 <span style={{ color: "#0f172a", fontWeight: 700 }}>{m.myValue}</span>
                    {m.avgValue && (<> &nbsp;·&nbsp; 또래 평균 <span style={{ color: "#64748b", fontWeight: 600 }}>{m.avgValue}</span></>)}
                  </div>
                  {m.comment && <span style={{ fontSize: "0.72rem", color: s.color, fontStyle: "italic" }}>{m.comment}</span>}
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
  const bmiColor = bmi < 18.5 ? "#2563eb" : bmi < 25 ? "#16a34a" : bmi < 30 ? "#d97706" : "#dc2626";
  const fatColor = fatPct < 15 ? "#2563eb" : fatPct < 25 ? "#16a34a" : fatPct < 30 ? "#d97706" : "#dc2626";

  return (
    <div className="card fade-in">
      <div className="section-title"><span>📊</span> 체성분 분석 결과</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
        <Metric label="체중" value={data.weight} unit="kg" color="#0f172a" />
        {data.height && <Metric label="신장" value={data.height} unit="cm" color="#0f172a" />}
        <Metric label="BMI" value={data.bmi} color={bmiColor} />
        <Metric label="체지방률" value={data.bodyFatPercent} unit="%" color={fatColor} />
        <Metric label="골격근량" value={data.muscleMass} unit="kg" color="#2563eb" />
        <Metric label="체지방량" value={data.bodyFatMass} unit="kg" color="#dc2626" />
        <Metric label="체수분" value={data.tbw} unit="kg" color="#0369a1" />
        <Metric label="기초대사량" value={data.bmr} unit="kcal" color="#ea580c" />
        {data.visceralFat && <Metric label="내장지방" value={data.visceralFat} color="#d97706" />}
      </div>
      {data.evaluation && (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "0.75rem", padding: "1rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#ea580c", fontWeight: 700, marginBottom: "0.4rem" }}>💡 종합 평가</div>
          <p style={{ color: "#374151", lineHeight: 1.7, fontSize: "0.875rem" }}>{data.evaluation}</p>
        </div>
      )}
      {data.peerComparison && <PeerSection data={data.peerComparison} />}
    </div>
  );
}
