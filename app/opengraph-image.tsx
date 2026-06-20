import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "알파고 공인중개사사무소 | AI가 추천하는 옥정동부동산";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RED = "#E60028";
const NAVY = "#161616";

export default async function Image() {
  const base = join(process.cwd(), "assets", "og");
  const [kang, kwon, bold, black] = await Promise.all([
    readFile(join(base, "kang.jpg")),
    readFile(join(base, "kwon.jpg")),
    readFile(join(base, "Pretendard-Bold.otf")),
    readFile(join(base, "Pretendard-Black.otf")),
  ]);
  const kangSrc = `data:image/jpeg;base64,${kang.toString("base64")}`;
  const kwonSrc = `data:image/jpeg;base64,${kwon.toString("base64")}`;

  const agentBox = (src: string, name: string) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        width={190}
        height={242}
        style={{ objectFit: "cover", border: `4px solid ${RED}`, borderRadius: 8 }}
      />
      <div style={{ marginTop: 14, fontSize: 26, fontFamily: "PreBold", color: "#fff" }}>
        {name}
      </div>
      <div style={{ fontSize: 18, fontFamily: "PreBold", color: "rgba(255,255,255,0.55)" }}>
        공인중개사
      </div>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: NAVY,
          position: "relative",
        }}
      >
        {/* 우측 빨강 사선 블록 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "44%",
            height: "100%",
            background: RED,
            clipPath: "polygon(26% 0, 100% 0, 100% 100%, 0 100%)",
            display: "flex",
          }}
        />

        {/* 좌측 텍스트 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "70px 64px",
            width: "62%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontFamily: "PreBold",
              color: RED,
              letterSpacing: 1,
              marginBottom: 18,
            }}
          >
            AI가 추천하는 옥정동부동산
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontFamily: "PreBlack",
              color: "#fff",
              lineHeight: 1.15,
            }}
          >
            알파고
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontFamily: "PreBlack",
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: 22,
            }}
          >
            공인중개사사무소
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontFamily: "PreBold",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.4,
            }}
          >
            옥정신도시 아파트 실거래가 · 시세 · 단지정보
          </div>
        </div>

        {/* 우측 두 중개사 사진 */}
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          {agentBox(kangSrc, "강은주")}
          {agentBox(kwonSrc, "권정욱")}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "PreBold", data: bold, weight: 700, style: "normal" },
        { name: "PreBlack", data: black, weight: 900, style: "normal" },
      ],
    }
  );
}
