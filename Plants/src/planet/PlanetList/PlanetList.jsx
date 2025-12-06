// src/planet/PlanetList/PlanetList.jsx
import React, { useRef } from "react";
import "./PlanetList.css";
import PlanetPreview from "../PlanetPreview/PlanetPreview";

export default function PlanetList({ system }) {
  const {
    planetList,
    hoveredListPlanet,
    setHoveredListPlanet,
    popupOpen,
    mediaPopup,
    setMediaPopup,
    setPopupOpen,
    setInputName,
    setInputFile,
    setInputTag,
    setTags,
    isPausedRef,
  } = system;

  const itemRefs = useRef([]);

  return (
    <>
      {planetList.length === 0 && (
        <button
          className="add-planet-button"
          onClick={() => {
            setPopupOpen(true);
            setTags([]);
            setInputName("");
            setInputFile([]);
            setInputTag("");
            isPausedRef.current = true;
          }}
        >
          행성 추가
        </button>
      )}
      {planetList.length > 0 && (
      <div className="planet-list">
        {planetList.map((p, idx) => {
          
          // ★ [수정] 표시할 미디어 결정 로직
          // 1순위: previewFiles (행성 생성 시 추가한 파일)
          // 2순위: mediaList (추후 추가한 미디어 파일)
          const previewFile = p.previewFiles && p.previewFiles.length > 0 
            ? p.previewFiles[0] 
            : null;
            
          const normalMedia = p.mediaList && p.mediaList.length > 0 
            ? p.mediaList[0] 
            : null;

          // 우선순위에 따라 결정
          const displayMedia = previewFile || normalMedia;

          // url이나 media 속성이 유효한지 체크
          const validMedia = displayMedia && (displayMedia.mediaType || displayMedia.media || displayMedia.url) 
            ? displayMedia 
            : null;

          const canPreview =
            hoveredListPlanet === p.id &&
            !popupOpen &&
            !mediaPopup &&
            validMedia && // media -> validMedia로 변경
            typeof p.screenX === "number" &&
            typeof p.screenY === "number";

          return (
            <React.Fragment key={`planet-${p.id}`}>
              {canPreview && (
                // validMedia를 media prop으로 전달
                <PlanetPreview x={p.screenX} y={p.screenY} media={validMedia} />
              )}

              <div
                className="planet-list-item"
                ref={(el) => (itemRefs.current[idx] = el)}
                onMouseEnter={() => {
                  if (!popupOpen && !mediaPopup) {
                    setHoveredListPlanet(p.id);
                    isPausedRef.current = true;
                  }
                }}
                onMouseLeave={() => {
                  if (!mediaPopup) {
                    setHoveredListPlanet(null);
                    isPausedRef.current = false;
                  }
                }}
                onClick={() => {
                    setMediaPopup({ planet: p, zoomIndex: null });
                    isPausedRef.current = true;
                  }}
              >
                {p.name}
              </div>
            </React.Fragment>
          );
        })}

        <button
            className="small-add-button"
            onClick={() => {
              setPopupOpen(true);
              setTags([]);
              setInputName("");
              setInputFile([]);
              setInputTag("");
              isPausedRef.current = true;
            }}
          >
            +
          </button>
      </div>
      )}
    </>
  );
}