"use client";

import { useCallback, useRef, useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import BodyCompositionCard from "@/components/BodyCompositionCard";
import WaterIntakeCard from "@/components/WaterIntakeCard";
import WeightRoutineCard from "@/components/WeightRoutineCard";
import CardioRoutineCard from "@/components/CardioRoutineCard";
import NutritionCard from "@/components/NutritionCard";
import SupplementsCard from "@/components/SupplementsCard";

const ACCEPTED = "image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    if (f.type.startsWith("image/")) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const text = await res.text();
      if (!text) throw new Error("서버 응답이 비어있습니다. 잠시 후 다시 시도해주세요.");
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.error ?? "분석 중 오류가 발생했습니다.");
      setResult(data as AnalysisResult);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null); setPreview(null); setResult(null); setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      {/* Header */}
      <header style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 1.5rem",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "36px", height: "36px",
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            borderRadius: "0.625rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem",
          }}>💪</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>InBody 분석기</div>
            <div style={{ fontSize: "0.65rem", color: "#94a3b8" }}>맞춤 운동 · 영양 플랜</div>
          </div>
        </div>
        {result && (
          <button onClick={reset} style={{
            fontSize: "0.8rem", color: "#64748b",
            background: "#f8fafc", border: "1px solid #e2e8f0",
            padding: "0.4rem 0.875rem", borderRadius: "0.5rem", cursor: "pointer",
          }}>새로 분석</button>
        )}
      </header>

      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>

        {!result && (
          <>
            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                background: "#fff7ed", border: "1px solid #fed7aa",
                borderRadius: "999px", padding: "0.3rem 0.875rem",
                fontSize: "0.75rem", fontWeight: 600, color: "#ea580c",
                marginBottom: "1rem",
              }}>
                ✨ AI 인바디 분석
              </div>
              <h1 style={{
                fontSize: "clamp(1.75rem, 5vw, 2.4rem)", fontWeight: 900,
                color: "#0f172a", lineHeight: 1.2, marginBottom: "0.75rem",
              }}>
                인바디 결과지를 올리면<br />
                <span style={{ color: "#f97316" }}>맞춤 플랜</span>을 만들어드려요
              </h1>
              <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7 }}>
                수분 섭취 · 웨이트 루틴 · 유산소 루틴 · 영양 분석 · 영양제 추천
              </p>
            </div>

            {/* 기능 배지 */}
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
              {[
                { icon: "💧", text: "수분 섭취 스케줄", color: "#3b82f6" },
                { icon: "🏋️", text: "웨이트 루틴",     color: "#f97316" },
                { icon: "🏃", text: "유산소 루틴",     color: "#f97316" },
                { icon: "🥗", text: "영양 분석",       color: "#3b82f6" },
                { icon: "💊", text: "영양제 추천",     color: "#3b82f6" },
              ].map(b => (
                <div key={b.text} style={{
                  display: "flex", alignItems: "center", gap: "0.35rem",
                  background: "#ffffff", border: "1px solid #e2e8f0",
                  borderRadius: "999px", padding: "0.35rem 0.875rem",
                  fontSize: "0.78rem", fontWeight: 600, color: "#334155",
                  boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
                }}>
                  <span>{b.icon}</span> {b.text}
                </div>
              ))}
            </div>

            {/* Upload */}
            <div style={{ maxWidth: "520px", margin: "0 auto" }}>
              <div
                className={`upload-zone${isDragging ? " dragover" : ""}`}
                style={{ borderRadius: "1rem", padding: "2rem", cursor: "pointer", textAlign: "center" }}
                onClick={() => inputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
              >
                <input ref={inputRef} type="file" accept={ACCEPTED} style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                {preview ? (
                  <div>
                    <img src={preview} alt="미리보기" style={{ maxHeight: "260px", maxWidth: "100%", borderRadius: "0.75rem", objectFit: "contain" }} />
                    <div style={{ marginTop: "0.75rem", fontSize: "0.82rem", color: "#64748b" }}>{file?.name}</div>
                  </div>
                ) : file ? (
                  <div style={{ padding: "1.5rem 0" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📄</div>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{file.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.25rem" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                ) : (
                  <div style={{ padding: "1.5rem 0" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
                    <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "1rem", marginBottom: "0.5rem" }}>
                      인바디 결과지를 업로드하세요
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#94a3b8", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                      드래그 앤 드롭하거나 클릭해서 파일 선택<br />JPG · PNG · PDF · 최대 20MB
                    </div>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "0.4rem",
                      background: "#fff7ed", border: "1px solid #fed7aa",
                      color: "#ea580c", padding: "0.5rem 1.25rem",
                      borderRadius: "0.625rem", fontSize: "0.85rem", fontWeight: 700,
                    }}>
                      📁 파일 선택
                    </div>
                  </div>
                )}
              </div>

              {file && (
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                  <button className="btn-primary" style={{ flex: 1 }} onClick={analyze} disabled={loading}>
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem" }}>
                        <div className="spinner" /> AI가 분석 중...
                      </span>
                    ) : "🔍 분석 시작"}
                  </button>
                  <button onClick={reset} style={{
                    padding: "0.75rem 1rem", background: "#f8fafc",
                    border: "1px solid #e2e8f0", borderRadius: "0.75rem",
                    color: "#64748b", cursor: "pointer",
                  }}>취소</button>
                </div>
              )}

              {error && (
                <div style={{
                  marginTop: "1rem", background: "#fef2f2",
                  border: "1px solid #fecaca", borderRadius: "0.75rem",
                  padding: "1rem", color: "#dc2626", fontSize: "0.875rem",
                }}>
                  ⚠️ {error}
                </div>
              )}

              {loading && (
                <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.875rem" }}>
                    {["체성분 분석 중", "운동 루틴 설계 중", "영양 분석 중"].map((s, i) => (
                      <div key={i} style={{
                        padding: "0.35rem 0.75rem",
                        background: "#fff7ed", border: "1px solid #fed7aa",
                        borderRadius: "999px", fontSize: "0.72rem",
                        color: "#ea580c", fontWeight: 600,
                      }}>{s}</div>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Gemini AI가 분석하고 있어요 (10~20초 소요)</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Results */}
        {result && (
          <div id="results" style={{ display: "grid", gap: "1.25rem" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "1rem",
              padding: "0.875rem 1.25rem",
              background: "#ffffff", border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              boxShadow: "0 1px 4px rgba(15,23,42,0.04)",
            }}>
              {preview && <img src={preview} alt="" style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }} />}
              <div>
                <div style={{ fontSize: "0.75rem", color: "#f97316", fontWeight: 700 }}>✅ 분석 완료</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{file?.name}</div>
              </div>
              <button onClick={reset} style={{
                marginLeft: "auto", fontSize: "0.78rem", color: "#64748b",
                background: "#f8fafc", border: "1px solid #e2e8f0",
                padding: "0.35rem 0.75rem", borderRadius: "0.5rem", cursor: "pointer",
              }}>다시 분석</button>
            </div>

            <BodyCompositionCard data={result.bodyComposition} />
            <WaterIntakeCard data={result.waterIntake} />
            <WeightRoutineCard data={result.weightRoutine} />
            <CardioRoutineCard data={result.cardioRoutine} />
            <NutritionCard data={result.nutritionAnalysis} />
            <SupplementsCard data={result.supplements} />
          </div>
        )}
      </main>
    </div>
  );
}
