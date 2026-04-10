"use client";

import type { WaterIntake } from "@/lib/types";

export default function WaterIntakeCard({ data }: { data: WaterIntake }) {
  const total = parseFloat(data.dailyLiters);
  const glasses = Math.round(total / 0.25);

  return (
    <div className="card fade-in">
      <div className="section-title">
        <span>💧</span> 하루 권장 수분 섭취량
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#3b82f6", lineHeight: 1 }}>
            {data.dailyLiters}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "0.25rem" }}>리터 / 일</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
          {Array.from({ length: Math.min(glasses, 12) }).map((_, i) => (
            <span key={i} style={{ fontSize: "1.4rem" }}>🥛</span>
          ))}
        </div>
      </div>

      {data.reasoning && (
        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.25rem", lineHeight: 1.6 }}>
          {data.reasoning}
        </p>
      )}

      <div style={{ display: "grid", gap: "0.5rem" }}>
        {data.schedule.map((item, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.625rem 0.875rem",
            background: "rgba(59,130,246,0.07)",
            borderRadius: "0.625rem",
            border: "1px solid rgba(59,130,246,0.12)",
          }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "#3b82f6", flexShrink: 0 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "0.85rem", color: "#e2e8f0", fontWeight: 600 }}>{item.time}</span>
              {item.tip && <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "0.5rem" }}>{item.tip}</span>}
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#60a5fa", flexShrink: 0 }}>{item.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
