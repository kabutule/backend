// src/planet/MediaPopup/MediaPopup.jsx
import React, { useState } from "react";
import "./MediaPopup.css";
import MediaAddPopup from "../MediaAddPopup/MediaAddPopup";
import ReportPopup from "../ReportPopup/ReportPopup";
import MediaEditPopup from "../MediaEditPopup/MediaEditPopup";
// ★ [추가] 새로 만든 컴포넌트 import
import PlanetEditPopup from "../PlanetEditPopup/PlanetEditPopup";

export default function MediaPopup({ system }) {
  const {
    mediaPopup,
    setMediaPopup,
    openMediaAddPopupForPlanet,
    closeMediaPopup,
    deletePlanet,
    updatePlanet, // system에서 전달받아야 함
    deleteMediaFromPlanet,
    toggleLike,
    toggleStar,
    reportMedia,
  } = system;

  // 팝업 상태들
  const [reportPopup, setReportPopup] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  
  // ★ [수정] 행성 수정 팝업 open/close 상태만 관리 (내부 로직은 PlanetEditPopup으로 이동됨)
  const [isPlanetEditOpen, setIsPlanetEditOpen] = useState(false);

  if (!mediaPopup) return null;

  const planet = mediaPopup.planet;
  const zoomIndex = mediaPopup.zoomIndex;

  // --- 기존 핸들러들 ---
  const handleDeletePlanet = () => {
    if (window.confirm(`정말로 '${planet.name}' 행성을 삭제하시겠습니까?`)) {
      if (deletePlanet) deletePlanet(planet.id);
      closeMediaPopup();
    }
  };

  const handleDeleteMedia = () => {
    if (zoomIndex === null) return;
    if (window.confirm(`정말로 이 미디어 항목을 삭제하시겠습니까?`)) {
      deleteMediaFromPlanet(planet.id, zoomIndex);
    }
  };

  const handleLike = () => { if (zoomIndex !== null) toggleLike(planet.id, zoomIndex); };
  const handleStar = () => { if (zoomIndex !== null) toggleStar(planet.id, zoomIndex); };
  
  const handleReport = () => {
    if (zoomIndex === null) return;
    const media = planet.mediaList[zoomIndex];
    if (media.reported) {
      alert("신고는 미디어당 한번만 가능합니다.");
      return;
    }
    setReportPopup({ planetId: planet.id, mediaIndex: zoomIndex });
  };

  const handleReportSubmit = (planetId, mediaIndex, reason) => {
    reportMedia(planetId, mediaIndex, reason);
  };

  // ★ [추가] 행성 정보 저장 실행 핸들러
  const handlePlanetSave = (planetId, newName, newFile) => {
    if (updatePlanet) {
        updatePlanet(planetId, newName, newFile);
    } else {
        console.error("updatePlanet function is missing in system prop");
    }
  };

  const currentMedia = zoomIndex !== null ? planet.mediaList[zoomIndex] : null;

  return (
    <>
      <div className="media-overlay">
        {zoomIndex === null ? (
          /* ======================= Grid View ======================= */
          <div
            className="media-grid-wrapper"
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative" }}
          >
            <div className="media-close" onClick={closeMediaPopup}>
              ×
            </div>

            {/* 좌측 상단 컨트롤 영역 */}
            <div className="planet-header-controls">
              <div className="planet-title-display">{planet.name}</div>
              
              <div className="planet-action-buttons">
                {/* ★ [수정] 버튼 클릭 시 상태만 변경 */}
                <button 
                  className="planet-btn-common planet-edit-btn" 
                  onClick={() => setIsPlanetEditOpen(true)}
                >
                  정보 수정
                </button>
                <button 
                  className="planet-btn-common planet-delete-btn" 
                  onClick={handleDeletePlanet}
                >
                  행성 삭제
                </button>
              </div>
            </div>

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
              <p className="no-media-message">아직 이 행성에 등록된 미디어가 없습니다.</p>
            )}
          </div>
        ) : (
          /* ======================= Zoom View ======================= */
          <div className="media-view-panel" onClick={(e) => e.stopPropagation()}>
            <div className="zoom-content-wrapper">
                {(() => {
                const item = planet.mediaList[zoomIndex];
                return item.mediaType === "image" ? (
                    <img src={item.url} alt="" className="media-big" />
                ) : (
                    <video src={item.url} controls autoPlay className="media-big" />
                );
                })()}
                <div className="zoom-meta-tags">
                {currentMedia.tags?.map((t, i) => (
                    <span key={i} className="zoom-tag-item">#{t}</span>
                ))}
                </div>
                {currentMedia.location?.trim() !== "" && (
                <div className="zoom-meta-location">📍 {currentMedia.location}</div>
                )}
                <div className="zoom-meta-description">
                {String(currentMedia.description || "").trim() !== ""
                    ? currentMedia.description
                    : "설명이 없습니다."}
                </div>
            </div>

            <button className="media-delete-button" onClick={handleDeleteMedia}>🗑️</button>
            <button className="media-edit-button" onClick={() => setShowEditPopup(true)}>✏️</button>
            <div className="media-close" onClick={() => setMediaPopup({ planet, zoomIndex: null })}>×</div>
            
            <div className="media-interaction-bar">
                <button className={`interaction-btn like-btn ${currentMedia?.liked ? "active" : ""}`} onClick={handleLike} title="좋아요">
                {currentMedia?.liked ? "❤️" : "🤍"}
                </button>
                <button className={`interaction-btn star-btn ${currentMedia?.starred ? "active" : ""}`} onClick={handleStar} title="즐겨찾기">
                {currentMedia?.starred ? "⭐" : "☆"}
                </button>
                <button className={`interaction-btn report-btn ${currentMedia?.reported ? "active" : ""}`} onClick={handleReport} title="신고">
                🚨
                </button>
            </div>
          </div>
        )}

        <MediaAddPopup system={system} />
      </div>

      <ReportPopup
        reportPopup={reportPopup}
        onClose={() => setReportPopup(null)}
        onSubmit={handleReportSubmit}
      />

      {showEditPopup && currentMedia && (
        <MediaEditPopup
          media={currentMedia}
          planetId={planet.id}
          mediaIndex={zoomIndex}
          onClose={() => setShowEditPopup(false)}
          system={system}
        />
      )}

      {/* ★ [추가] 행성 정보 수정 팝업 컴포넌트 사용 */}
      <PlanetEditPopup
        isOpen={isPlanetEditOpen}
        onClose={() => setIsPlanetEditOpen(false)}
        planet={planet}
        onSave={handlePlanetSave}
      />
    </>
  );
}