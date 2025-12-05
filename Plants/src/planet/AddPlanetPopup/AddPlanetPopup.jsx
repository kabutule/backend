// src/planet/AddPlanetPopup/AddPlanetPopup.jsx
import React from "react";
import "./AddPlanetPopup.css";

export default function AddPlanetPopup({ system }) {
  const {
    popupOpen,
    closeAddPopup,
    inputName,
    setInputName,
    inputFile,
    handleFileChange,
    fileInputRef,
    addPlanet,
  } = system;

  if (!popupOpen) return null;

  return (
    <div className="popup-overlay" onClick={closeAddPopup}>
      <div className="popup-panel" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "6px" }}>행성 추가</h2>

        <input
          className="input-text"
          placeholder="행성 이름"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
        />

        <div>
          <button
            className="file-select-button"
            onClick={() => fileInputRef.current.click()}
          >
            파일 선택
          </button>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* 미리보기 */}
        <div className="preview-strip">
          {inputFile.map((m, i) => (
            <div key={i} className="preview-item">
              {m.mediaType === "image" ? (
                <img src={m.url} alt="" />
              ) : (
                <video src={m.url} muted />
              )}
            </div>
          ))}
        </div>

        <div className="popup-buttons">
          <button
            className="popup-add"
            onClick={() => {
              const success = addPlanet(inputName, inputFile);
              if (success) closeAddPopup();
            }}
          >
            생성
          </button>

          <button className="popup-close" onClick={closeAddPopup}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
