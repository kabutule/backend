// src/planet/MediaAddPopup/MediaAddPopup.jsx
import React, { useState, useEffect } from "react";
import "./MediaAddPopup.css";

export default function MediaAddPopup({ system }) {
  const { mediaAddPopup, setMediaAddPopup, addMediaToPlanet, updatePlanetMeta  } = system;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewList, setPreviewList] = useState([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [inputTag, setInputTag] = useState("");
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    if (!mediaAddPopup) return;

    const planet = mediaAddPopup.planet;

    setDescription(planet.description || "");
    setLocation(planet.location || "");
    setSelectedFiles([]);
    setPreviewList([]);
    setTagList(planet.tags ? [...planet.tags] : []);
  }, [mediaAddPopup]);

  if (!mediaAddPopup) return null;

  const planet = mediaAddPopup.planet;

  // ★ [수정] 파일 변경 핸들러 - 올바른 형식으로 변환
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // 1. 프리뷰용 객체 생성 (화면 표시용)
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      mediaType: file.type.startsWith("video") ? "video" : "image",
    }));

    // 2. addMediaToPlanet에 전달할 형식으로 변환
    const formattedFiles = files.map((file) => ({
      url: URL.createObjectURL(file),
      mediaType: file.type.startsWith("video") ? "video" : "image",
    }));

    setSelectedFiles((prev) => [...prev, ...formattedFiles]);
    setPreviewList((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const handleAddTag = () => {
    const value = inputTag.trim();
    if (!value) return;

    if (!tagList.includes(value)) {
      setTagList((prev) => [...prev, value]);
    }

    setInputTag("");
  };

  const handleSave = () => {
    // 1) 추가되는 파일이 있다 → 미디어마다 meta 포함해서 집어넣기
    if (selectedFiles.length > 0) {
      const mediaItems = selectedFiles.map((file) => ({
        ...file,            // url, mediaType
        tags: [...tagList],
        location,
        description,
        liked: false,
        starred: false,
        reported: false
      }));

    addMediaToPlanet(planet.id, mediaItems);
  }

  handleClose();
};


  const handleClose = () => {
    setMediaAddPopup(null);
    setDescription("");
    setLocation("");
    setTagList([]);
    setInputTag("");
    setSelectedFiles([]);
    setPreviewList([]);
  };

  return (
    <div className="media-add-overlay" onClick={handleClose}>
      <div className="media-add-panel" onClick={(e) => e.stopPropagation()}>
        <h2>미디어 추가 / 정보 수정</h2>

        <button
          className="file-select-button"
          onClick={() => document.getElementById("media-add-file").click()}
        >
          파일 선택
        </button>

        <input
          id="media-add-file"
          type="file"
          multiple
          accept="image/*,video/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div className="preview-strip">
          {previewList.map((item, i) => (
            <div key={i} className="preview-item">
              {item.mediaType === "image" ? (
                <img src={item.url} alt="" />
              ) : (
                <video src={item.url} />
              )}
            </div>
          ))}
        </div>

        <label className="file-label">설명</label>
        <textarea
          className="media-desc-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="file-label">Location</label>
        <input
          className="input-text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="예: Seoul / School / Home..."
        />

        <label className="file-label">태그</label>
        <div className="tag-input-row">
          <input
            className="input-text"
            value={inputTag}
            placeholder="태그 입력"
            onChange={(e) => setInputTag(e.target.value)}
          />
          <button className="tag-add-btn" onClick={handleAddTag}>
            추가
          </button>
        </div>

        <div className="tag-preview">
          {tagList.map((tag, i) => (
            <span key={i} className="tag-item">
              #{tag}
            </span>
          ))}
        </div>

        <div className="popup-buttons">
          <button className="popup-add" onClick={handleSave}>
            저장
          </button>
          <button className="popup-cancel" onClick={handleClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}