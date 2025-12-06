// src/planet/AddPlanetPopup/AddPlanetPopup.jsx
import React, { useState, useEffect } from "react"; // useState, useEffect 추가
import "./AddPlanetPopup.css";

export default function AddPlanetPopup({ system }) {
  const {
    popupOpen,
    closeAddPopup,
    inputName,
    setInputName,
    inputFile,
    setInputFile,
    handleFileChange,
    fileInputRef,
    addPlanet,
  } = system;

  // ★ [추가] 에러 메시지 상태 관리
  const [errorMessage, setErrorMessage] = useState("");

  // 팝업이 열릴 때마다 에러 메시지 초기화
  useEffect(() => {
    if (popupOpen) {
      setErrorMessage("");
    }
  }, [popupOpen]);

  if (!popupOpen) return null;

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = inputFile.filter((_, idx) => idx !== indexToRemove);
    setInputFile(updatedFiles);
    if (fileInputRef.current) fileInputRef.current.value = "";
    
    // 파일 삭제 시 경고 메시지가 있었다면(개수 초과 등) 초기화해주는 것이 좋음
    setErrorMessage(""); 
  };

  // ★ [수정] 생성 버튼 클릭 시 유효성 검사 로직
  const handleCreate = () => {
    // 1. 이름 누락 혹은 파일 누락 체크
    if (!inputName.trim() || inputFile.length === 0) {
      setErrorMessage("이름 혹은 썸네일을 넣지 않았습니다");
      return;
    }

    // 2. 파일 개수 초과 체크
    if (inputFile.length > 1) {
      setErrorMessage("썸네일은 한개만 지정 가능합니다");
      return;
    }

    // 3. 통과 시 생성
    const success = addPlanet(inputName, inputFile);
    if (success) {
      closeAddPopup();
    }
  };

  return (
    <div className="popup-overlay" onClick={closeAddPopup}>
      <div className="popup-panel" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "6px" }}>행성 추가</h2>

        <input
          className="input-text"
          placeholder="행성 이름"
          value={inputName}
          onChange={(e) => {
            setInputName(e.target.value);
            setErrorMessage(""); // 입력 시 에러 초기화
          }}
        />

        <div className="file-select-area">
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
            onChange={(e) => {
              handleFileChange(e);
              setErrorMessage(""); // 파일 선택 시 에러 초기화
            }}
          />

          {/* (선택 사항) 파일 선택 즉시 보여주는 경고는 유지하거나 에러 메시지 박스로 통합 가능 */}
          {inputFile.length > 1 && (
            <div className="warning-box">
              ⚠️ 썸네일은 한개만 지정 가능합니다
            </div>
          )}
        </div>

        <div className="preview-strip">
          {inputFile.map((m, i) => (
            <div key={i} className="preview-item">
              <div 
                className="preview-delete-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(i);
                }}
              >
                ×
              </div>
              {m.mediaType === "image" ? (
                <img src={m.url} alt="" />
              ) : (
                <video src={m.url} muted />
              )}
            </div>
          ))}
        </div>

        {/* ★ [추가] 에러 메시지 표시 영역 (버튼 위) */}
        {errorMessage && (
          <div className="error-message-box">
            ⛔ {errorMessage}
          </div>
        )}

        <div className="popup-buttons">
          <button
            className="popup-add"
            onClick={handleCreate}
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