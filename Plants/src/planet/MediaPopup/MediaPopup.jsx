// src/planet/MediaPopup/MediaPopup.jsx
import React, { useState } from "react";
import "./MediaPopup.css";
import MediaAddPopup from "../MediaAddPopup/MediaAddPopup";
import ReportPopup from "../ReportPopup/ReportPopup";

export default function MediaPopup({ system }) {
  const {
    mediaPopup,
    setMediaPopup,
    openMediaAddPopupForPlanet,
    closeMediaPopup,
    deletePlanet,
    deleteMediaFromPlanet,
    toggleLike,
    toggleStar,
    reportMedia,
  } = system;

  // ReportPopup 상태 관리
  const [reportPopup, setReportPopup] = useState(null);

  if (!mediaPopup) return null;

  const planet = mediaPopup.planet;
  const zoomIndex = mediaPopup.zoomIndex;

  const handleDeletePlanet = () => {
    if (window.confirm(`정말로 '${planet.name}' 행성을 삭제하시겠습니까?`)) {
      if (deletePlanet) deletePlanet(planet.id);
      closeMediaPopup();
    }
  };

  const handleDeleteMedia = () => {
    if (zoomIndex === null) return;

    if (
      window.confirm(
        `정말로 이 미디어 항목을 삭제하시겠습니까? (현재 ${
          planet.mediaList.length
        }개 중 ${zoomIndex + 1}번째)`
      )
    ) {
      deleteMediaFromPlanet(planet.id, zoomIndex);
    }
  };

  const handleLike = () => {
    if (zoomIndex === null) return;
    toggleLike(planet.id, zoomIndex);
  };

  const handleStar = () => {
    if (zoomIndex === null) return;
    toggleStar(planet.id, zoomIndex);
  };

  // 신고 버튼 클릭 시 ReportPopup 열기
  const handleReport = () => {
    if (zoomIndex === null) return;
    const media = planet.mediaList[zoomIndex];

  // 🔒 이미 신고된 경우
  if (media.reported) {
    alert("신고는 미디어당 한번만 가능합니다.");
    return;
  }

  // 신고 팝업 열기
  setReportPopup({
    planetId: planet.id,
    mediaIndex: zoomIndex,
  });
  };

  // ★ [추가] ReportPopup에서 신고 제출
  const handleReportSubmit = (planetId, mediaIndex, reason) => {
    console.log(`🚨 신고 제출: 행성 ${planetId}, 미디어 ${mediaIndex}, 사유: ${reason}`);
    reportMedia(planetId, mediaIndex, reason);
  };

  const getCurrentMedia = () => {
    if (zoomIndex === null) return null;
    return planet.mediaList[zoomIndex];
  };

  const currentMedia = planet.mediaList[zoomIndex];

  return (
    <>
      <div className="media-overlay">
        {zoomIndex === null ? (
          /* Grid View */
          <div
            className="media-grid-wrapper"
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative" }}
          >
            <div className="media-close" onClick={closeMediaPopup}>
              ×
            </div>

              <button className="planet-delete-button" onClick={handleDeletePlanet}>
                행성 삭제
              </button>
            

            <div className="media-grid">
              <button
                className="media-add-button"
                onClick={() => openMediaAddPopupForPlanet(planet)}
              >
                +
              </button>

              {planet.mediaList?.map((item, idx) => (
                <div
                  key={idx}
                  className="media-thumb"
                  onClick={() => setMediaPopup({ planet, zoomIndex: idx })}
                >
                  {item.mediaType === "image" ? (
                    <img src={item.url} alt="" />
                  ) : (
                    <video src={item.url} muted />
                  )}
                </div>
              ))}
            </div>

            {planet.mediaList?.length === 0 && (
              <p className="no-media-message">
                아직 이 행성에 등록된 미디어가 없습니다.
              </p>
            )}

            <div className="media-tags-grid">
              {planet.tags?.map((t, i) => (
                <span key={i} className="media-tag">
                  #{t}
                </span>
              ))}

              {planet.location?.trim() !== "" && (
                <span className="media-tag media-location-tag">
                  📍 {planet.location}
                </span>
              )}
            </div>

            <div className="media-description-box">
              {String(planet.description || "").trim() !== ""
                ? String(planet.description)
                : "설명이 없습니다."}
            </div>
          </div>
        ) : (
          /* ======================= Zoom View ======================= */
<div className="media-view-panel" onClick={(e) => e.stopPropagation()}>
  
  <div className="zoom-content-wrapper">

    {/* 큰 이미지 */}
    {(() => {
      const item = planet.mediaList[zoomIndex];
      return item.mediaType === "image" ? (
        <img src={item.url} alt="" className="media-big" />
      ) : (
        <video src={item.url} controls autoPlay className="media-big" />
      );
    })()}

    {/* 태그 */}
    <div className="zoom-meta-tags">
      {currentMedia.tags?.map((t, i) => (
      <span key={i} className="zoom-tag-item">
        #{t}
      </span>
        ))}
    </div>

    {/* location */}
    {currentMedia.location?.trim() !== "" && (
      <div className="zoom-meta-location">
        📍 {currentMedia.location}
      </div>
    )}


    {/* description */}
  <div className="zoom-meta-description">
    {String(currentMedia.description || "").trim() !== ""
      ? currentMedia.description
      : "설명이 없습니다."}
  </div>


  </div>

  {/* 삭제 버튼 */}
  <button className="media-delete-button" onClick={handleDeleteMedia}>
    🗑️
  </button>

  {/* 닫기 버튼 */}
  <div
    className="media-close"
    onClick={() => setMediaPopup({ planet, zoomIndex: null })}
  >
    ×
  </div>

  {/* 좋아요/별/신고 */}
  <div className="media-interaction-bar">
    <button
      className={`interaction-btn like-btn ${currentMedia?.liked ? "active" : ""}`}
      onClick={handleLike}
      title="좋아요"
    >
      {currentMedia?.liked ? "❤️" : "🤍"}
    </button>

    <button
      className={`interaction-btn star-btn ${currentMedia?.starred ? "active" : ""}`}
      onClick={handleStar}
      title="즐겨찾기"
    >
      {currentMedia?.starred ? "⭐" : "☆"}
    </button>

    <button
      className={`interaction-btn report-btn ${currentMedia?.reported ? "active" : ""}`}
      onClick={handleReport}
      title="신고"
    >
      🚨
    </button>
  </div>

</div>

        )}

        <MediaAddPopup system={system} />
      </div>

      {/* ★ [추가] ReportPopup 렌더링 */}
      <ReportPopup
        reportPopup={reportPopup}
        onClose={() => setReportPopup(null)}
        onSubmit={handleReportSubmit}
      />
    </>
  );
}