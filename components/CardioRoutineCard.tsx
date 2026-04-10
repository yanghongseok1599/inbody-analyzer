"use client";
import type { CardioRoutine } from "@/lib/types";

const INTENSITY: Record<string, { color: string; bg: string; border: string }> = {
  "저강도": { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "중강도": { color: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
  "고강도": { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

function getIntensity(s: string) {
  for (const [k, v] of Object.entries(INTENSITY)) { if (s.includes(k)) return v; }
  return INTENSITY["중강도"];
}

export default function CardioRoutineCard({ data }: { data: CardioRoutine }) {
  return (
    <div className="card fade-in">
      <div className="section-title"><span>🏃</span> 유산소 운동 루틴</div>
      <div style={{ display: "flex", gap: "0.875rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.625rem", padding: "0.625rem 1rem" }}>
          <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>주 빈도</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#16a34a" }}>{data.weeklyFrequency}회</div>
        </div>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "0.625rem", padding: "0.625rem 1rem" }}>
          <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>세션 당</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#2563eb" }}>{data.totalMinutesPerSession}분</div>
        </div>
      </div>
      <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
        {data.exercises.map((ex, i) => {
          const t = getIntensity(ex.intensity);
          return (
            <div key={i} style={{ border: `1px solid ${t.border}`, borderLeft: `4px solid ${t.color}`, borderRadius: "0.75rem", padding: "0.875rem 1rem", background: t.bg }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>{ex.name}</div>
                <span style={{ fontSize: "0.7rem", background: `${t.color}15`, color: t.color, border: `1px solid ${t.color}30`, padding: "0.2rem 0.6rem", borderRadius: "999px", fontWeight: 700 }}>{ex.intensity}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.5rem" }}>
                {[{ icon: "⏱", label: "시간", val: ex.duration }, { icon: "📅", label: "빈도", val: ex.frequency }, { icon: "❤️", label: "목표 심박수", val: ex.heartRateTarget }]
                  .filter(x => x.val)
                  .map(({ icon, label, val }) => (
                    <div key={label} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.5rem", padding: "0.4rem 0.625rem" }}>
                      <div style={{ fontSize: "0.62rem", color: "#94a3b8" }}>{icon} {label}</div>
                      <div style={{ fontSize: "0.8rem", color: "#0f172a", fontWeight: 600 }}>{val}</div>
                    </div>
                  ))}
              </div>
              {ex.note && <p style={{ fontSize: "0.77rem", color: "#64748b", marginTop: "0.5rem" }}>{ex.note}</p>}
            </div>
          );
        })}
      </div>
      {data.generalNote && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "0.625rem", padding: "0.875rem", fontSize: "0.83rem", color: "#374151", lineHeight: 1.6 }}>
          💡 {data.generalNote}
        </div>
      )}
    </div>
  );
}
