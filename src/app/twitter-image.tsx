/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
// @ts-nocheck

import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  let fontData, imageData;

  try {
    fontData = await fetch(
      new URL("../assets/fonts/Sora-ExtraBold.ttf", import.meta.url),
    ).then((res) => res.arrayBuffer());
  } catch (error) {
    console.error("Failed to load font:", error);
    throw error;
  }

  try {
    imageData = await fetch(
      new URL("../assets/logo.png", import.meta.url),
    ).then((res) => res.arrayBuffer());
  } catch (error) {
    console.error("Failed to load image:", error);
    throw error;
  }

  return new ImageResponse(
    (
      <div
        style={{ fontFamily: "Sora" }}
        tw="flex justify-between items-center bg-black h-full w-full text-white p-24 relative"
      >
        <div tw="border-r border-[#52525b] h-2/3 flex justify-center items-center pr-24">
          <img width={300} height={45} src={imageData} />
        </div>
        <h1 tw="text-6xl font-extrabold capitalize leading-none tracking-tight flex flex-col text-center">
          <div>Make</div>
          <div>Form Management</div>
          <div
            style={{
              backgroundImage: "linear-gradient(90deg, #d4d4d8, #52525b)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Effortless
          </div>
        </h1>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Sora",
          data: fontData,
          style: "normal",
        },
      ],
    },
  );
}
