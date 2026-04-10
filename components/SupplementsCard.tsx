"use client";
import type { Supplement } from "@/lib/types";

const PRIORITY_MAP = {
  high:   { label: "필수", color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
  medium: { label: "권장", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  low:    { label: "선택", color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
};

export default function SupplementsCard({ data }: { data: Supplement[] }) {
  const grouped = {
    high:   data.filter(s => s.priority === "high"),
    medium: data.filter(s => s.priority === "medium"),
    low:    data.filter(s => s.priority === "low"),
  };

  return (
    <div className="card fade-in">
      <div className="section-title"><span>💊</span> 영양제 추천</div>
      {(["high", "medium", "low"] as const).map(priority => {
        const items = grouped[priority];
        if (!items.length) return null;
        const p = PRIORITY_MAP[priority];
        return (
          <div key={priority} style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color }} />
              <span style={{ fontSize: "0.75rem", color: p.color, fontWeight: 700 }}>{p.label}</span>
            </div>
            <div style={{ display: "grid", gap: "0.625rem" }}>
              {items.map((s, i) => (
                <div key={i} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: "0.75rem", padding: "0.875rem 1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>{s.name}</div>
                    <span style={{ fontSize: "0.68rem", color: p.color, background: `${p.color}15`, padding: "0.2rem 0.6rem", borderRadius: "999px", border: `1px solid ${p.color}25`, fontWeight: 700 }}>{p.label}</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.625rem", lineHeight: 1.5 }}>{s.reason}</p>
                  <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.5rem", padding: "0.3rem 0.625rem", fontSize: "0.75rem" }}>
                      <span style={{ color: "#94a3b8" }}>복용량 </span><span style={{ color: "#0f172a", fontWeight: 600 }}>{s.dosage}</span>
                    </div>
                    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "0.5rem", padding: "0.3rem 0.625rem", fontSize: "0.75rem" }}>
                      <span style={{ color: "#94a3b8" }}>복용 시기 </span><span style={{ color: "#0f172a", fontWeight: 600 }}>{s.timing}</span>
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
