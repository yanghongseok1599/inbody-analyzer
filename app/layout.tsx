import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InBody 분석기 | 맞춤 운동·영양 플랜",
  description: "인바디 결과지를 업로드하면 맞춤 운동 루틴과 영양제를 추천해드립니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
