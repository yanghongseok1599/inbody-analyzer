"use client";

import { useState } from "react";
import type { WeightRoutine, WorkoutDay } from "@/lib/types";

const DAY_COLORS = ["#f97316", "#3b82f6", "#a855f7", "#22c55e", "#ec4899"];

function DayPanel({ day, color, isOpen, onToggle }: { day: WorkoutDay; color: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ border: `1px solid ${color}30`, borderRadius: "0.75rem", overflow: "hidden", marginBottom: "0.75rem" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.875rem 1rem", background: `${color}15`, cursor: "pointer", border: "none",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontWeight: 700, color, fontSize: "0.9rem" }}>{day.day}</span>
          <span style={{ fontSize: "0.8rem", color: "#94a3b8", background: "rgba(148,163,184,0.1)", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>
            {day.focus}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{day.exercises.length}가지 운동</span>
          <span style={{ color: "#64748b", fontSize: "1rem" }}>{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>

      {isOpen && (
        <div style={{ padding: "0.875rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 60px", gap: "0.5rem", padding: "0 0.5rem 0.5rem", borderBottom: "1px solid #1e2d45" }}>
            {["운동명", "세트", "횟수", "휴식"].map(h => (
              <div key={h} style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>
          {day.exercises.map((ex, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 60px", gap: "0.5rem", padding: "0.625rem 0.5rem", borderBottom: "1px solid rgba(30,45,69,0.5)", alignItems: "start" }}>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#e2e8f0" }}>{ex.name}</div>
                {ex.tip && <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.2rem", lineHeight: 1.4 }}>{ex.tip}</div>}
              </div>
              <div style={{ fontSize: "0.875rem", color, fontWeight: 700 }}>{ex.sets}세트</div>
              <div style={{ fontSize: "0.875rem", color: "#e2e8f0" }}>{ex.reps}회</div>
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{ex.rest}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WeightRoutineCard({ data }: { data: WeightRoutine }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="card fade-in">
      <div className="section-title">
        <span>🏋️</span> 웨이트 운동 루틴
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "0.625rem", padding: "0.625rem 1rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#64748b" }}>주 빈도</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f97316" }}>{data.weeklyFrequency}회</div>
        </div>
        {data.goal && (
          <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "0.625rem", padding: "0.625rem 1rem", flex: 1 }}>
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>운동 목표</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#4ade80", marginTop: "0.1rem" }}>{data.goal}</div>
          </div>
        )}
      </div>

      {data.schedule.map((day, i) => (
        <DayPanel
          key={i}
          day={day}
          color={DAY_COLORS[i % DAY_COLORS.length]}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
        />
      ))}
    </div>
  );
}
