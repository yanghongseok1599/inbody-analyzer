import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import { computePeerComparison } from "@/lib/knhanes";
import type { AnalysisResult } from "@/lib/types";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function extractJson(text: string): string {
  // Remove markdown code blocks if present
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  // Find the outermost JSON object
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) return cleaned.slice(start, end + 1);
  return cleaned;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY가 설정되지 않았습니다." }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "파일 데이터를 읽을 수 없습니다." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "파일 크기가 너무 큽니다. (최대 20MB)" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "application/pdf"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "지원하지 않는 파일 형식입니다. JPG, PNG, PDF를 사용해주세요." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  let text: string;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0,       // 결정적 출력 (동일 입력 → 동일 출력)
        topP: 1,
        topK: 1,
      },
    });

    const result = await model.generateContent([
      { text: buildPrompt() },
      {
        inlineData: {
          mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/heic" | "image/heif" | "application/pdf",
          data: base64,
        },
      },
    ]);

    text = result.response.text();
    console.log("Gemini raw response:", text.slice(0, 300));
  } catch (e) {
    console.error("Gemini API error:", e);
    const msg = e instanceof Error ? e.message : "Gemini API 호출 실패";
    return NextResponse.json({ error: `AI 분석 오류: ${msg}` }, { status: 502 });
  }

  let parsed: AnalysisResult;
  try {
    parsed = JSON.parse(extractJson(text));
  } catch {
    console.error("JSON parse failed. Raw response:", text);
    return NextResponse.json(
      { error: "분석 결과를 파싱할 수 없습니다. 인바디 결과지 이미지인지 확인해주세요." },
      { status: 422 }
    );
  }

  // KNHANES 국가 통계 기반 또래 비교 서버사이드 계산
  try {
    const bc = parsed.bodyComposition;
    const peerComparison = computePeerComparison({
      gender:      bc.gender   ?? "여성",
      ageGroup:    bc.ageGroup ?? "30대",
      muscleMass:  parseFloat(bc.muscleMass)    || 0,
      bodyFatPct:  parseFloat(bc.bodyFatPercent) || 0,
      bmi:         parseFloat(bc.bmi)            || 0,
      bmr:         parseFloat(bc.bmr)            || 0,
      tbw:         parseFloat(bc.tbw)            || 0,
    });
    parsed.bodyComposition.peerComparison = peerComparison;
  } catch (e) {
    console.error("peerComparison compute error:", e);
  }

  return NextResponse.json(parsed);
}
