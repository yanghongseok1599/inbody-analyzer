"use client";
import type { NutritionAnalysis } from "@/lib/types";

const SEVERITY_MAP = {
  mild:     { label: "경미", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  moderate: { label: "보통", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  severe:   { label: "심각", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

export default function NutritionCard({ data }: { data: NutritionAnalysis }) {
  return (
    <div className="card fade-in">
      <div className="section-title"><span>🥗</span> 영양 상태 분석</div>
      <div style={{ display: "flex", gap: "0.875rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "0.75rem", padding: "0.875rem 1.25rem" }}>
          <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>일일 권장 칼로리</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f97316" }}>{data.dailyCalorieTarget} <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "#94a3b8" }}>kcal</span></div>
        </div>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "0.75rem", padding: "0.875rem 1.25rem" }}>
          <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>단백질 목표</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#2563eb" }}>{data.proteinTarget} <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "#94a3b8" }}>g</span></div>
        </div>
      </div>
      {data.deficientNutrients.length > 0 && (
        <>
          <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700, marginBottom: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>부족한 영양소</div>
          <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1.25rem" }}>
            {data.deficientNutrients.map((item, i) => {
              const s = SEVERITY_MAP[item.severity] ?? SEVERITY_MAP.mild;
              return (
                <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "0.625rem", padding: "0.75rem 1rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.68rem", color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}30`, padding: "0.2rem 0.6rem", borderRadius: "999px", fontWeight: 700, flexShrink: 0, marginTop: "0.1rem" }}>{s.label}</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.875rem" }}>{item.nutrient}</div>
                    <div style={{ fontSize: "0.77rem", color: "#64748b", marginTop: "0.15rem", lineHeight: 1.5 }}>{item.reason}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {data.dietRecommendation && (
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "0.75rem", padding: "1rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#ea580c", fontWeight: 700, marginBottom: "0.4rem" }}>🍽 식단 방향</div>
          <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.7 }}>{data.dietRecommendation}</p>
        </div>
      )}
    </div>
  );
}
