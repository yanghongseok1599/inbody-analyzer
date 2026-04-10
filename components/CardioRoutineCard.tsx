"use client";

import type { CardioRoutine } from "@/lib/types";

const INTENSITY_COLOR: Record<string, string> = {
  "저강도": "#22c55e",
  "중강도": "#f97316",
  "고강도": "#ef4444",
};

function intensityColor(intensity: string) {
  for (const [key, val] of Object.entries(INTENSITY_COLOR)) {
    if (intensity.includes(key)) return val;
  }
  return "#f97316";
}

export default function CardioRoutineCard({ data }: { data: CardioRoutine }) {
  return (
    <div className="card fade-in">
      <div className="section-title">
        <span>🏃</span> 유산소 운동 루틴
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "0.625rem", padding: "0.625rem 1rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#64748b" }}>주 빈도</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#22c55e" }}>{data.weeklyFrequency}회</div>
        </div>
        <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "0.625rem", padding: "0.625rem 1rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#64748b" }}>세션 당</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#60a5fa" }}>{data.totalMinutesPerSession}분</div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
        {data.exercises.map((ex, i) => {
          const color = intensityColor(ex.intensity);
          return (
            <div key={i} style={{
              border: `1px solid ${color}25`,
              borderLeft: `3px solid ${color}`,
              borderRadius: "0.625rem",
              padding: "0.875rem 1rem",
              background: `${color}08`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.625rem" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#e2e8f0" }}>{ex.name}</div>
                <span style={{ fontSize: "0.7rem", background: `${color}20`, color, border: `1px solid ${color}30`, padding: "0.2rem 0.5rem", borderRadius: "999px", fontWeight: 600 }}>
                  {ex.intensity}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.5rem" }}>
                {[
                  { icon: "⏱", label: "시간", val: ex.duration },
                  { icon: "📅", label: "빈도", val: ex.frequency },
                  { icon: "❤️", label: "목표 심박수", val: ex.heartRateTarget },
                ].map(({ icon, label, val }) => val && (
                  <div key={label} style={{ background: "rgba(30,45,69,0.5)", borderRadius: "0.5rem", padding: "0.4rem 0.6rem" }}>
                    <div style={{ fontSize: "0.65rem", color: "#64748b" }}>{icon} {label}</div>
                    <div style={{ fontSize: "0.8rem", color: "#cbd5e1", fontWeight: 600 }}>{val}</div>
                  </div>
                ))}
              </div>
              {ex.note && (
                <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "0.5rem" }}>{ex.note}</p>
              )}
            </div>
          );
        })}
      </div>

      {data.generalNote && (
        <div style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "0.625rem", padding: "0.875rem", fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>
          💡 {data.generalNote}
        </div>
      )}
    </div>
  );
}
