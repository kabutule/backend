// src/planet/PlanetEditPopup/PlanetEditPopup.jsx
import React, { useState, useRef, useEffect } from "react";
import "./PlanetEditPopup.css";

export default function PlanetEditPopup({ isOpen, onClose, planet, onSave }) {
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  // 팝업이 열릴 때 초기값 설정
  useEffect(() => {
    if (isOpen && planet) {
      setEditName(planet.name);
      setPreviewUrl(planet.preview || "");
      setEditFile(null);
    }
  }, [isOpen, planet]);

  if (!isOpen || !planet) return null;

  // 파일 선택 핸들러
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // 저장 핸들러
  const handleSave = () => {
    if (!editName.trim()) {
      alert("행성 이름을 입력해주세요.");
      return;
    }
    // 부모에게 변경된 이름과 파일 전달
    onSave(planet.id, editName, editFile);
    onClose();
  };

  return (
    <div className="planet-edit-overlay" onClick={onClose}>
      <div className="planet-edit-panel" onClick={(e) => e.stopPropagation()}>
        <h3>행성 정보 수정</h3>

        {/* 이름 입력 */}
        <div className="edit-input-group">
          <label className="edit-label">행성 이름</label>
          <input
            className="edit-input-text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="행성 이름을 입력하세요"
          />
        </div>

        {/* 썸네일 변경 */}
        <div className="edit-input-group">
          <label className="edit-label">대표 썸네일 변경</label>
          
          <div className="edit-thumbnail-preview">
            {previewUrl ? (
              <img src={previewUrl} alt="Thumbnail Preview" />
            ) : (
              <div className="no-preview-text">No Image</div>
            )}
          </div>

          <button
            className="edit-file-btn"
            onClick={() => fileInputRef.current.click()}
          >
            파일 선택
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*,video/*"
            onChange={handleThumbnailChange}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="edit-actions">
          <button className="edit-cancel-btn" onClick={onClose}>
            취소
          </button>
          <button className="edit-save-btn" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}