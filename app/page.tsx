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
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

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
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f1a" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e2d45",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "rgba(11,15,26,0.9)",
        backdropFilter: "blur(12px)",
        zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: "0.625rem", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>
            💪
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "#e2e8f0" }}>InBody 분석기</div>
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>맞춤 운동 · 영양 플랜</div>
          </div>
        </div>
        {result && (
          <button onClick={reset} style={{ fontSize: "0.8rem", color: "#64748b", background: "rgba(30,45,69,0.5)", border: "1px solid #1e2d45", padding: "0.4rem 0.875rem", borderRadius: "0.5rem", cursor: "pointer" }}>
            새로 분석
          </button>
        )}
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
        {/* Hero */}
        {!result && (
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 800, color: "#e2e8f0", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              인바디 결과지를 올리면<br />
              <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                맞춤 플랜
              </span>을 만들어드려요
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.7 }}>
              수분 섭취량 · 웨이트 루틴 · 유산소 루틴 · 영양 분석 · 영양제 추천
            </p>
          </div>
        )}

        {/* Upload */}
        {!result && (
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <div
              className={`upload-zone${isDragging ? " dragover" : ""}`}
              style={{ borderRadius: "1rem", padding: "2rem", cursor: "pointer", textAlign: "center", position: "relative" }}
              onClick={() => inputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />

              {preview ? (
                <div>
                  <img src={preview} alt="인바디 미리보기" style={{ maxHeight: "280px", maxWidth: "100%", borderRadius: "0.75rem", objectFit: "contain" }} />
                  <div style={{ marginTop: "0.875rem", fontSize: "0.85rem", color: "#94a3b8" }}>
                    {file?.name}
                  </div>
                </div>
              ) : file ? (
                <div style={{ padding: "1.5rem 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📄</div>
                  <div style={{ fontWeight: 600, color: "#e2e8f0" }}>{file.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.25rem" }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div style={{ padding: "1.5rem 0" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
                  <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: "1rem", marginBottom: "0.5rem" }}>
                    인바디 결과지를 업로드하세요
                  </div>
                  <div style={{ fontSize: "0.83rem", color: "#64748b", marginBottom: "1rem", lineHeight: 1.6 }}>
                    드래그 앤 드롭하거나 클릭해서 파일 선택<br />
                    JPG, PNG, PDF 지원 · 최대 20MB
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "#f97316", padding: "0.5rem 1rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: 600 }}>
                    파일 선택
                  </div>
                </div>
              )}
            </div>

            {file && (
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={analyze}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem" }}>
                      <div className="spinner" />
                      AI가 분석 중...
                    </span>
                  ) : "분석 시작"}
                </button>
                <button
                  onClick={reset}
                  style={{ padding: "0.75rem 1rem", background: "rgba(30,45,69,0.5)", border: "1px solid #1e2d45", borderRadius: "0.75rem", color: "#64748b", cursor: "pointer" }}
                >
                  취소
                </button>
              </div>
            )}

            {error && (
              <div style={{ marginTop: "1rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "0.75rem", padding: "1rem", color: "#f87171", fontSize: "0.875rem" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Loading overlay */}
            {loading && (
              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  {["체성분 분석", "운동 루틴 설계", "영양 분석"].map((step, i) => (
                    <div key={i} style={{
                      padding: "0.35rem 0.75rem",
                      background: "rgba(249,115,22,0.1)",
                      border: "1px solid rgba(249,115,22,0.2)",
                      borderRadius: "999px",
                      fontSize: "0.72rem",
                      color: "#f97316",
                      animation: `fadeIn ${0.3 + i * 0.3}s ease both`,
                    }}>
                      {step}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "0.82rem", color: "#64748b" }}>Gemini AI가 인바디를 분석하고 있어요 (10~20초 소요)</p>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <div id="results" style={{ display: "grid", gap: "1.25rem" }}>
            {/* Re-upload info */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1.25rem", background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: "0.75rem" }}>
              {preview && <img src={preview} alt="" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "0.5rem" }} />}
              <div>
                <div style={{ fontSize: "0.8rem", color: "#f97316", fontWeight: 600 }}>분석 완료</div>
                <div style={{ fontSize: "0.82rem", color: "#64748b" }}>{file?.name}</div>
              </div>
            </div>

            <BodyCompositionCard data={result.bodyComposition} />
            <WaterIntakeCard data={result.waterIntake} />
            <WeightRoutineCard data={result.weightRoutine} />
            <CardioRoutineCard data={result.cardioRoutine} />
            <NutritionCard data={result.nutritionAnalysis} />
            <SupplementsCard data={result.supplements} />

            <div style={{ textAlign: "center", paddingTop: "1rem" }}>
              <button onClick={reset} className="btn-primary">
                다시 분석하기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
