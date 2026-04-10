"use client";
import type { WaterIntake } from "@/lib/types";

export default function WaterIntakeCard({ data }: { data: WaterIntake }) {
  const glasses = Math.round(parseFloat(data.dailyLiters) / 0.25);
  return (
    <div className="card fade-in">
      <div className="section-title"><span>💧</span> 하루 권장 수분 섭취량</div>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontSize: "3.2rem", fontWeight: 900, color: "#2563eb", lineHeight: 1 }}>{data.dailyLiters}</div>
          <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "0.2rem" }}>리터 / 일</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
          {Array.from({ length: Math.min(glasses, 12) }).map((_, i) => <span key={i} style={{ fontSize: "1.4rem" }}>🥛</span>)}
        </div>
      </div>
      {data.reasoning && <p style={{ fontSize: "0.83rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.6, background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "0.625rem", padding: "0.75rem 1rem" }}>{data.reasoning}</p>}
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {data.schedule.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.625rem 0.875rem", background: "#eff6ff", borderRadius: "0.625rem", border: "1px solid #bfdbfe" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 800, color: "#fff", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: 600 }}>{item.time}</span>
              {item.tip && <span style={{ fontSize: "0.73rem", color: "#64748b", marginLeft: "0.5rem" }}>{item.tip}</span>}
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#2563eb", flexShrink: 0 }}>{item.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
