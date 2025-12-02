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
    inputTag,
    setInputTag,
    tags,
    setTags,
    description,
    setDescription,
    location,
    setLocation,
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

        <textarea
          className="input-text"
          placeholder="설명 입력"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ minHeight: "70px" }}
        />

        <textarea
          className="input-text"
          placeholder="Location 입력"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ minHeight: "60px" }}
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

        <div className="tag-input-row">
          <input
            className="input-text"
            style={{ flex: 1 }}
            placeholder="태그 추가"
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
          />
          <button
            className="tag-add-btn"
            onClick={() => {
              if (inputTag.trim() === "") return;
              setTags([...tags, inputTag.trim()]);
              setInputTag("");
            }}
          >
            추가
          </button>
        </div>

        <div className="tag-preview">
          {tags.map((t, i) => (
            <span key={i} className="tag-item">
              #{t}
            </span>
          ))}
        </div>

        <div className="popup-buttons">
          <button
            className="popup-add"
            onClick={() => {
              const success = addPlanet(inputName, inputFile, tags, description, location);
              if(success)
                  closeAddPopup();
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