// src/planet/ReportPopup/ReportPopup.jsx
import React, { useState, useEffect } from "react";
import "./ReportPopup.css";

export default function ReportPopup({ reportPopup, onClose, onSubmit }) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  // 팝업이 열릴 때마다 초기화
  useEffect(() => {
    if (reportPopup) {
      setSelectedReason("");
      setCustomReason("");
    }
  }, [reportPopup]);

  if (!reportPopup) return null;

  const { planetId, mediaIndex } = reportPopup;

  // 신고 사유 옵션
  const reportReasons = [
    "부적절한 콘텐츠",
    "스팸 또는 광고",
    "폭력적이거나 혐오스러운 콘텐츠",
    "저작권 침해",
    "개인정보 노출",
    "기타",
  ];

  const handleSubmit = () => {
    // 선택된 사유 확인
    if (!selectedReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    // "기타" 선택 시 커스텀 사유 필수
    if (selectedReason === "기타" && customReason.trim() === "") {
      alert("기타 사유를 입력해주세요.");
      return;
    }

    // 최종 신고 사유
    const finalReason = selectedReason === "기타" ? customReason : selectedReason;

    // 신고 데이터 전송
    onSubmit(planetId, mediaIndex, finalReason);
    onClose();
  };

  return (
    <div className="report-overlay" onClick={onClose}>
      <div className="report-panel" onClick={(e) => e.stopPropagation()}>
        <h2>🚨 미디어 신고</h2>
        <p className="report-description">
          이 콘텐츠를 신고하는 이유를 선택해주세요.
        </p>

        {/* 신고 사유 선택 */}
        <div className="report-reasons">
          {reportReasons.map((reason, index) => (
            <label key={index} className="report-reason-item">
              <input
                type="radio"
                name="reportReason"
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
              />
              <span>{reason}</span>
            </label>
          ))}
        </div>

        {/* 기타 사유 입력란 */}
        {selectedReason === "기타" && (
          <textarea
            className="report-custom-input"
            placeholder="신고 사유를 자세히 입력해주세요..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            maxLength={200}
          />
        )}

        {/* 버튼 그룹 */}
        <div className="report-buttons">
          <button className="report-submit-btn" onClick={handleSubmit}>
            신고하기
          </button>
          <button className="report-cancel-btn" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}