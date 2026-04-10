"use client";
import { useState } from "react";
import type { WeightRoutine, WorkoutDay } from "@/lib/types";

const DAY_COLORS = ["#f97316", "#2563eb", "#7c3aed", "#16a34a", "#db2777"];

function DayPanel({ day, color, isOpen, onToggle }: { day: WorkoutDay; color: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ border: `1px solid ${color}25`, borderRadius: "0.75rem", overflow: "hidden", marginBottom: "0.625rem" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: isOpen ? `${color}10` : "#f8fafc", cursor: "pointer", border: "none", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: "#fff" }}>
            {day.day.replace("Day ", "")}
          </div>
          <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" }}>{day.focus}</span>
          <span style={{ fontSize: "0.72rem", color: "#94a3b8", background: "#f1f5f9", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>{day.exercises.length}가지</span>
        </div>
        <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div style={{ padding: "0.875rem", background: "#ffffff" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 60px", gap: "0.5rem", padding: "0 0.5rem 0.625rem", borderBottom: "1px solid #f1f5f9", marginBottom: "0.25rem" }}>
            {["운동명", "세트", "횟수", "휴식"].map(h => <div key={h} style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>{h}</div>)}
          </div>
          {day.exercises.map((ex, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 60px 80px 60px", gap: "0.5rem", padding: "0.625rem 0.5rem", borderBottom: "1px solid #f8fafc", alignItems: "start" }}>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>{ex.name}</div>
                {ex.tip && <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "0.15rem", lineHeight: 1.4 }}>{ex.tip}</div>}
              </div>
              <div style={{ fontSize: "0.875rem", color, fontWeight: 700 }}>{ex.sets}세트</div>
              <div style={{ fontSize: "0.875rem", color: "#374151" }}>{ex.reps}회</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{ex.rest}</div>
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
      <div className="section-title"><span>🏋️</span> 웨이트 운동 루틴</div>
      <div style={{ display: "flex", gap: "0.875rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "0.625rem", padding: "0.625rem 1rem" }}>
          <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>주 빈도</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f97316" }}>{data.weeklyFrequency}회</div>
        </div>
        {data.goal && (
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "0.625rem", padding: "0.625rem 1rem", flex: 1 }}>
            <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>운동 목표</div>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a", marginTop: "0.1rem" }}>{data.goal}</div>
          </div>
        )}
      </div>
      {data.schedule.map((day, i) => (
        <DayPanel key={i} day={day} color={DAY_COLORS[i % DAY_COLORS.length]} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
      ))}
    </div>
  );
}
