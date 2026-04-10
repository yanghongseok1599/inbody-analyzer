"use client";

import type { Supplement } from "@/lib/types";

const PRIORITY_MAP = {
  high: { label: "필수", color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.25)", dot: "#f97316" },
  medium: { label: "권장", color: "#eab308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.25)", dot: "#eab308" },
  low: { label: "선택", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)", dot: "#22c55e" },
};

export default function SupplementsCard({ data }: { data: Supplement[] }) {
  const grouped = {
    high: data.filter(s => s.priority === "high"),
    medium: data.filter(s => s.priority === "medium"),
    low: data.filter(s => s.priority === "low"),
  };

  return (
    <div className="card fade-in">
      <div className="section-title">
        <span>💊</span> 영양제 추천
      </div>

      {(["high", "medium", "low"] as const).map(priority => {
        const items = grouped[priority];
        if (!items.length) return null;
        const p = PRIORITY_MAP[priority];
        return (
          <div key={priority} style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.dot }} />
              <span style={{ fontSize: "0.75rem", color: p.color, fontWeight: 700 }}>{p.label}</span>
            </div>
            <div style={{ display: "grid", gap: "0.625rem" }}>
              {items.map((s, i) => (
                <div key={i} style={{
                  background: p.bg,
                  border: `1px solid ${p.border}`,
                  borderRadius: "0.75rem",
                  padding: "0.875rem 1rem",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "0.95rem" }}>{s.name}</div>
                    <span style={{ fontSize: "0.7rem", color: p.color, background: `${p.color}20`, padding: "0.2rem 0.6rem", borderRadius: "999px", border: `1px solid ${p.color}30` }}>
                      {p.label}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.625rem", lineHeight: 1.5 }}>{s.reason}</p>
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <div style={{ background: "rgba(30,45,69,0.6)", borderRadius: "0.5rem", padding: "0.3rem 0.625rem", fontSize: "0.75rem" }}>
                      <span style={{ color: "#64748b" }}>복용량 </span>
                      <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{s.dosage}</span>
                    </div>
                    <div style={{ background: "rgba(30,45,69,0.6)", borderRadius: "0.5rem", padding: "0.3rem 0.625rem", fontSize: "0.75rem" }}>
                      <span style={{ color: "#64748b" }}>복용 시기 </span>
                      <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{s.timing}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
