import React, { useState } from "react";
import "./MediaEditPopup.css";

export default function MediaEditPopup({ media, planetId, mediaIndex, onClose, system }) {
  const { updateMediaMeta } = system;

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(media.tags || []);
  const [description, setDescription] = useState(media.description || "");
  const [location, setLocation] = useState(media.location || "");

  const addTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    updateMediaMeta(planetId, mediaIndex, {
      tags,
      description,
      location,
    });

    onClose();
  };

  return (
    <div className="media-edit-overlay">
      <div className="media-edit-popup">
        
        <h2 className="edit-title">미디어 정보 편집</h2>

        <div className="edit-block">
          <label className="edit-label">태그</label>

          <div className="tag-input-box">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="태그 입력"
            />
            <button onClick={addTag}>추가</button>
          </div>

          <div className="tag-list">
            {tags.map((tag, index) => (
              <div key={index} className="tag-item">
                #{tag}
                <span className="tag-remove" onClick={() => removeTag(tag)}>
                  ✕
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="edit-block">
          <label className="edit-label">설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="미디어 설명 입력"
          />
        </div>

        <div className="edit-block">
          <label className="edit-label">위치 수정</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="위치 입력"
          />
        </div>

        <div className="edit-buttons">
          <button className="save-btn" onClick={handleSave}>
            저장
          </button>
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
        </div>

      </div>
    </div>
  );
}
