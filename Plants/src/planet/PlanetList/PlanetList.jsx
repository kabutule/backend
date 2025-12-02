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

      <div className="planet-list">
        {planetList.map((p, idx) => {
          const media =
            p.mediaList &&
            p.mediaList.length > 0 &&
            p.mediaList[0] &&
            (p.mediaList[0].mediaType || p.mediaList[0].media || p.mediaList[0].url)
              ? p.mediaList[0]
              : null;

          const canPreview =
            hoveredListPlanet === p.id &&
            !popupOpen &&
            !mediaPopup &&
            media &&
            typeof p.screenX === "number" &&
            typeof p.screenY === "number";

          return (
            <React.Fragment key={`planet-${p.id}`}>
              {canPreview && (
                <PlanetPreview x={p.screenX} y={p.screenY} media={p.mediaList[0]} />
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
                  if (media) {
                    setMediaPopup({ planet: p, zoomIndex: null });
                    isPausedRef.current = true;
                  }
                }}
              >
                {p.name}
              </div>
            </React.Fragment>
          );
        })}

        {planetList.length > 0 && (
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
        )}
      </div>
    </>
  );
}