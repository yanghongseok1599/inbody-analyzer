"use client";

import type { NutritionAnalysis } from "@/lib/types";

const SEVERITY_MAP = {
  mild: { label: "경미", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
  moderate: { label: "보통", color: "#eab308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.2)" },
  severe: { label: "심각", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
};

export default function NutritionCard({ data }: { data: NutritionAnalysis }) {
  return (
    <div className="card fade-in">
      <div className="section-title">
        <span>🥗</span> 영양 상태 분석
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "0.625rem", padding: "0.75rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#64748b" }}>일일 권장 칼로리</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#c084fc" }}>{data.dailyCalorieTarget} <span style={{ fontSize: "0.75rem" }}>kcal</span></div>
        </div>
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "0.625rem", padding: "0.75rem 1.25rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#64748b" }}>단백질 목표</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#4ade80" }}>{data.proteinTarget} <span style={{ fontSize: "0.75rem" }}>g</span></div>
        </div>
      </div>

      {data.deficientNutrients.length > 0 && (
        <>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.75rem", fontWeight: 600 }}>부족한 영양소</div>
          <div style={{ display: "grid", gap: "0.625rem", marginBottom: "1.25rem" }}>
            {data.deficientNutrients.map((item, i) => {
              const s = SEVERITY_MAP[item.severity] ?? SEVERITY_MAP.mild;
              return (
                <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "0.625rem", padding: "0.75rem 1rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.7rem", background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: "0.2rem 0.6rem", borderRadius: "999px", fontWeight: 700, flexShrink: 0, marginTop: "0.15rem" }}>
                    {s.label}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "0.875rem" }}>{item.nutrient}</div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.2rem", lineHeight: 1.5 }}>{item.reason}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {data.dietRecommendation && (
        <div style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: "0.75rem", padding: "1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "#a855f7", fontWeight: 600, marginBottom: "0.5rem" }}>🍽 식단 방향</div>
          <p style={{ fontSize: "0.875rem", color: "#cbd5e1", lineHeight: 1.7 }}>{data.dietRecommendation}</p>
        </div>
      )}
    </div>
  );
}
