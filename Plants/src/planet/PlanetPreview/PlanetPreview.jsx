// src/planet/PlanetPreview/PlanetPreview.jsx
import React from "react";
import { createPortal } from "react-dom";
import "./PlanetPreview.css";

export default function PlanetPreview({ x, y, media }) {
  if (!media) return null;

  const boxW = 140;
  const boxH = 140;

  const diagonalX = 120;
  const diagonalY = -120;

  const diagEndX = x + diagonalX;
  const diagEndY = y + diagonalY;
  const diagLen = Math.sqrt(diagonalX ** 2 + diagonalY ** 2);

  const line2Length = boxW;
  const centerX = diagEndX + line2Length / 2;
  const centerY = diagEndY;

  const content =
    media.mediaType === "image" ? (
      <img src={media.url || media.media} className="preview-img" alt="" />
    ) : (
      <video
        src={media.url || media.media}
        autoPlay
        loop
        muted
        className="preview-img"
      />
    );

  return createPortal(
    <div className="preview-root">
      <div
        className="preview-line1"
        style={{
          "--x": `${x}px`,
          "--y": `${y - 1}px`,
          "--len": `${diagLen}px`,
        }}
      />

      <div
        className="preview-line2"
        style={{
          "--x": `${diagEndX}px`,
          "--y": `${diagEndY}px`,
          "--len": `${line2Length}px`,
        }}
      />

      <div
        className="preview-box-wrapper"
        style={{
          "--boxW": `${boxW}px`,
          "--boxH": `${boxH}px`,
          "--cx": `${centerX}px`,
          "--cy": `${centerY}px`,
        }}
      >
        <div className="preview-box">{content}</div>
      </div>
    </div>,
    document.body
  );
}