// src/planet/SpaceContainer/SpaceContainer.jsx
import React from "react";
import "./SpaceContainer.css";

import usePlanetSystem from "../hooks/usePlanetSystem";

import CanvasLayer from "../CanvasLayer/CanvasLayer";
import PlanetList from "../PlanetList/PlanetList";
import AddPlanetPopup from "../AddPlanetPopup/AddPlanetPopup";
import MediaPopup from "../MediaPopup/MediaPopup";

export default function SpaceContainer() {
  const system = usePlanetSystem();

  return (
    <div ref={system.containerRef} className="space-container">
      <CanvasLayer system={system} />
      <PlanetList system={system} />
      {system.popupOpen && <AddPlanetPopup system={system} />}
      {system.mediaPopup && <MediaPopup system={system} />}
    </div>
  );
}