// usePlanetSystem.js — addMediaToPlanet 함수 수정 버전
import { useRef, useState, useEffect } from "react";

export default function usePlanetSystem() {
  /* -----------------------------------------------------
     Refs
  ----------------------------------------------------- */
  const planetsRef = useRef([]);
  const labelRefs = useRef([]);
  const isPausedRef = useRef(false);
  const nextId = useRef(0);
  const containerRef = useRef(null);

  /* -----------------------------------------------------
     UI States
  ----------------------------------------------------- */
  const [planetList, setPlanetList] = useState([]);
  const [hoveredListPlanet, setHoveredListPlanet] = useState(null);

  const [popupOpen, setPopupOpen] = useState(false);
  const [mediaPopup, setMediaPopup] = useState(null);
  const [mediaAddPopup, setMediaAddPopup] = useState(null);

  /* -----------------------------------------------------
     Inputs for AddPlanet
  ----------------------------------------------------- */
  const [inputName, setInputNameState] = useState("");
  const [inputFile, setInputFile] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const setInputName = (name) => {
    if (typeof name === 'string' && name.length > 7) {
      name = name.substring(0, 7);
    }
    setInputNameState(name);
  };

  /* -----------------------------------------------------
     Inputs for MediaAddPopup
  ----------------------------------------------------- */
  const [mediaDescription, setMediaDescription] = useState("");
  const [mediaLocation, setMediaLocation] = useState("");

  const fileInputRef = useRef(null);

  /* -----------------------------------------------------
     Fixed Planet Properties
  ----------------------------------------------------- */
  const fixedPlanets = [
    { name: "Mercury", r: 6, orbit: 100, speed: 0.0016, color: "#ffaa66" },
    { name: "Venus", r: 8, orbit: 150, speed: 0.0013, color: "#ffcc99" },
    { name: "Earth", r: 10, orbit: 200, speed: 0.001, color: "#44ccff" },
    { name: "Mars", r: 15, orbit: 250, speed: 0.0009, color: "#ff8844" },
    { name: "Jupiter", r: 22, orbit: 300, speed: 0.0007, color: "#ffcc88" },
    { name: "Saturn", r: 21, orbit: 350, speed: 0.0006, color: "#ffdd99" },
    { name: "Neptune", r: 25, orbit: 400, speed: 0.0005, color: "#88aaff" },
  ];

  useEffect(() => {
    const sortedPlanetList = [...planetList].sort((a, b) => a.id - b.id);
    planetsRef.current = sortedPlanetList;

    console.log("--- Planet List Updated ---");
    console.log(`현재 행성 개수: ${planetList.length}`);
    console.log("행성 ID 목록:", planetList.map(p => p.id).sort((a, b) => a - b));
    console.log(planetList);
    console.log("--------------------------");
  }, [planetList]);

  /* -----------------------------------------------------
     Find Next Planet ID
  ----------------------------------------------------- */
  const findNextPlanetId = (currentPlanetList) => {
    const existingIds = currentPlanetList.map(p => p.id).sort((a, b) => a - b);
    
    let nextId = 1;
    for (const id of existingIds) {
      if (id > nextId) {
        return nextId;
      }
      nextId++;
    }
    
    return nextId;
  };

  /* -----------------------------------------------------
     Add Planet
  ----------------------------------------------------- */
  const addPlanet = (name, mediaList, tagsArray, descriptionText, locationText) => {
    if (!name || name.trim() === "") {
      alert("행성 이름을 입력하세요.");
       return false;
    }

    if (!mediaList || mediaList.length === 0) {
      alert("행성을 생성하려면 최소 1개 이상의 파일을 첨부해야 합니다.");
      return false;
    }
   
    const newId = findNextPlanetId(planetList);

    const normalizedMedia = mediaList.map((it) => ({
      url: it.url,
      mediaType: it.mediaType,
      description: it.description || "",
      location: it.location || "",
      liked: false,
      likedAt: null,
      starred: false,
      starredAt: null,
      reported: false,
      reportedAt: null,
      reportCount: 0,
    }));

    const getPlanetColorById = (id) => {
      const hue = (newId * 137) % 360;
      const saturation = 80 + (id % 15);
      const lightness = 60 + (id % 15);
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const newPlanet = {
      id: newId,
      r: 10 + newId * 4,
      orbit: newId * 100 + 150,
      speed: 0.001 / newId,
      color: getPlanetColorById(newId),
      angle: Math.random() * Math.PI * 2,
      name,
      description: descriptionText,
      location: locationText,
      mediaList: normalizedMedia,
      tags: tagsArray,
      preview: normalizedMedia?.[0]?.url || null,
      screenX: 0,
      screenY: 0,
    };

    setPlanetList(prevList => [...prevList, newPlanet]);

    return true;
  };

  /* -----------------------------------------------------
     Delete Planet
  ----------------------------------------------------- */
  const deletePlanet = (planetId) => {
    console.log(`🗑️ 행성 삭제 시작: ID ${planetId}`);
    
    setHoveredListPlanet(null);
    setMediaPopup(null);
    isPausedRef.current = false;

    setPlanetList((prevList) => {
      const newList = prevList.filter((p) => p.id !== planetId);
      console.log(`✅ 삭제 완료. 남은 행성: ${newList.length}개`);
      console.log(`남은 행성 ID:`, newList.map(p => p.id));
      return newList;
    });
  };

  /* -----------------------------------------------------
     Add Media - ★ [수정] 파일 객체 처리 개선
  ----------------------------------------------------- */
  const addMediaToPlanet = (planetId, files, tagsArray, descriptionText, locationText) => {
    console.log("🎬 addMediaToPlanet 호출됨");
    console.log("전달된 files:", files);
    
    // ★ [수정] files 배열을 올바르게 정규화
    const normalizedMedia = files.map((file) => {
      // file이 이미 {url, mediaType} 형태인지 확인
      const fileUrl = file.url || file.media || URL.createObjectURL(file);
      const fileType = file.mediaType || (file.type?.startsWith("video") ? "video" : "image");
      
      console.log("정규화된 미디어:", { url: fileUrl, mediaType: fileType });
      
      return {
        url: fileUrl,
        mediaType: fileType,
        description: descriptionText,
        location: locationText,
        liked: false,
        likedAt: null,
        starred: false,
        starredAt: null,
        reported: false,
        reportedAt: null,
        reportCount: 0,
      };
    });

    setPlanetList(prevList => {
      const updatedList = prevList.map(p => {
        if (p.id !== planetId) {
          return p;
        }
        
        const updatedPlanet = { ...p };
        updatedPlanet.mediaList = [...(p.mediaList || []), ...normalizedMedia];
        updatedPlanet.tags = tagsArray;
        updatedPlanet.description = descriptionText;
        updatedPlanet.location = locationText;
        updatedPlanet.preview = updatedPlanet.mediaList[0]?.url || null;

        console.log("✅ 업데이트된 행성:", updatedPlanet);
        return updatedPlanet;
      });
      
      return updatedList;
    });

    // ★ [추가] mediaPopup 상태도 즉시 업데이트
    setMediaPopup(prevPopup => {
      if (!prevPopup || prevPopup.planet.id !== planetId) return prevPopup;
      
      // 업데이트된 행성 데이터 찾기
      const updatedPlanet = planetList.find(p => p.id === planetId);
      if (!updatedPlanet) return prevPopup;
      
      return {
        ...prevPopup,
        planet: {
          ...updatedPlanet,
          mediaList: [...(updatedPlanet.mediaList || []), ...normalizedMedia],
        }
      };
    });
  };

  /* -----------------------------------------------------
     Delete Media From Planet - ★ [수정] 상태 업데이트 개선
  ----------------------------------------------------- */
  const deleteMediaFromPlanet = (planetId, mediaIndex) => {
    console.log(`🗑️ 미디어 삭제 시작: 행성 ${planetId}, 인덱스 ${mediaIndex}`);
    
    let shouldDeletePlanet = false;
    let updatedPlanet = null;

    setPlanetList(prevList => {
      const targetPlanet = prevList.find(p => p.id === planetId);
      
      if (!targetPlanet) {
        console.log("❌ 대상 행성을 찾을 수 없음");
        return prevList;
      }

      console.log(`현재 미디어 개수: ${targetPlanet.mediaList.length}`);
      
      const newMediaList = targetPlanet.mediaList.filter((_, idx) => idx !== mediaIndex);
      console.log(`삭제 후 미디어 개수: ${newMediaList.length}`);

      // 미디어가 0개가 되면 행성 삭제
      if (newMediaList.length === 0) {
        console.log("⚠️ 미디어가 0개 → 행성 삭제");
        shouldDeletePlanet = true;
        setHoveredListPlanet(null);
        isPausedRef.current = false;
        
        return prevList.filter(p => p.id !== planetId);
      }

      // 미디어가 남아있으면 업데이트
      const newList = prevList.map(p => {
        if (p.id !== planetId) {
          return p;
        }

        updatedPlanet = {
          ...p,
          mediaList: newMediaList,
          preview: newMediaList[0]?.url || null,
        };
        
        console.log("✅ 업데이트된 행성:", updatedPlanet);
        return updatedPlanet;
      });

      return newList;
    });

    // ★ [수정] mediaPopup 상태 업데이트를 setPlanetList 외부에서 처리
    setMediaPopup(prevPopup => {
      if (!prevPopup || prevPopup.planet.id !== planetId) {
        return prevPopup;
      }

      // 행성이 삭제된 경우
      if (shouldDeletePlanet) {
        console.log("🔴 행성 삭제로 인한 팝업 닫기");
        return null;
      }

      // 미디어가 남아있는 경우 - Grid View로 전환
      if (updatedPlanet) {
        console.log("🔄 Grid View로 전환");
        return {
          planet: updatedPlanet,
          zoomIndex: null
        };
      }

      return prevPopup;
    });
  };

  /* -----------------------------------------------------
     Toggle Like
  ----------------------------------------------------- */
  const toggleLike = (planetId, mediaIndex) => {
    setPlanetList(prevList => {
      return prevList.map(p => {
        if (p.id !== planetId) return p;

        const updatedMediaList = p.mediaList.map((media, idx) => {
          if (idx !== mediaIndex) return media;
          
          const newLikedState = !media.liked;
          console.log(`❤️ 좋아요 ${newLikedState ? '추가' : '취소'}: 행성 ${planetId}, 미디어 ${mediaIndex}`);
          
          return {
            ...media,
            liked: newLikedState,
            likedAt: newLikedState ? new Date().toISOString() : null,
          };
        });

        return {
          ...p,
          mediaList: updatedMediaList,
        };
      });
    });

    setMediaPopup(prev => {
      if (!prev || prev.planet.id !== planetId) return prev;
      
      return {
        ...prev,
        planet: {
          ...prev.planet,
          mediaList: prev.planet.mediaList.map((media, idx) => {
            if (idx !== mediaIndex) return media;
            return {
              ...media,
              liked: !media.liked,
              likedAt: !media.liked ? new Date().toISOString() : null,
            };
          }),
        },
      };
    });
  };

  /* -----------------------------------------------------
     Toggle Star
  ----------------------------------------------------- */
  const toggleStar = (planetId, mediaIndex) => {
    setPlanetList(prevList => {
      return prevList.map(p => {
        if (p.id !== planetId) return p;

        const updatedMediaList = p.mediaList.map((media, idx) => {
          if (idx !== mediaIndex) return media;
          
          const newStarredState = !media.starred;
          console.log(`⭐ 별 ${newStarredState ? '추가' : '취소'}: 행성 ${planetId}, 미디어 ${mediaIndex}`);
          
          return {
            ...media,
            starred: newStarredState,
            starredAt: newStarredState ? new Date().toISOString() : null,
          };
        });

        return {
          ...p,
          mediaList: updatedMediaList,
        };
      });
    });

    setMediaPopup(prev => {
      if (!prev || prev.planet.id !== planetId) return prev;
      
      return {
        ...prev,
        planet: {
          ...prev.planet,
          mediaList: prev.planet.mediaList.map((media, idx) => {
            if (idx !== mediaIndex) return media;
            return {
              ...media,
              starred: !media.starred,
              starredAt: !media.starred ? new Date().toISOString() : null,
            };
          }),
        },
      };
    });
  };

  /* -----------------------------------------------------
     Report Media - ★ [수정] 신고 사유 추가
  ----------------------------------------------------- */
  const reportMedia = (planetId, mediaIndex, reason) => {
    console.log(`🚨 신고 접수: 행성 ${planetId}, 미디어 ${mediaIndex}, 사유: ${reason}`);
    
    setPlanetList(prevList => {
      return prevList.map(p => {
        if (p.id !== planetId) return p;

        const updatedMediaList = p.mediaList.map((media, idx) => {
          if (idx !== mediaIndex) return media;
          
          return {
            ...media,
            reported: true,
            reportedAt: new Date().toISOString(),
            reportCount: (media.reportCount || 0) + 1,
            reportReason: reason, // ★ 신고 사유 저장
            reportHistory: [
              ...(media.reportHistory || []),
              {
                reason: reason,
                timestamp: new Date().toISOString(),
              }
            ], // ★ 신고 이력 저장
          };
        });

        return {
          ...p,
          mediaList: updatedMediaList,
        };
      });
    });

    setMediaPopup(prev => {
      if (!prev || prev.planet.id !== planetId) return prev;
      
      return {
        ...prev,
        planet: {
          ...prev.planet,
          mediaList: prev.planet.mediaList.map((media, idx) => {
            if (idx !== mediaIndex) return media;
            return {
              ...media,
              reported: true,
              reportedAt: new Date().toISOString(),
              reportCount: (media.reportCount || 0) + 1,
              reportReason: reason,
              reportHistory: [
                ...(media.reportHistory || []),
                {
                  reason: reason,
                  timestamp: new Date().toISOString(),
                }
              ],
            };
          }),
        },
      };
    });

    alert("신고가 접수되었습니다.");
  };

  /* -----------------------------------------------------
     MediaAddPopup Open
  ----------------------------------------------------- */
  const openMediaAddPopupForPlanet = (p) => {
    setMediaAddPopup({ planet: p });
  };

  /* -----------------------------------------------------
     Handle File Change
  ----------------------------------------------------- */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const previewList = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      mediaType: file.type.startsWith("video") ? "video" : "image",
      description: "",
      location: "",
    }));

    setInputFile((prev) => [...prev, ...previewList]);
    e.target.value = "";
  };

  /* -----------------------------------------------------
     Close Add Popup
  ----------------------------------------------------- */
  const closeAddPopup = () => {
    setPopupOpen(false);
    setHoveredListPlanet(null);
    isPausedRef.current = false;

    setInputFile([]);
    setTags([]);
    setInputTag("");
    setInputName("");
    setDescription("");
    setLocation("");
  };

  /* -----------------------------------------------------
     Close Media Popup
  ----------------------------------------------------- */
  const closeMediaPopup = () => {
    setMediaPopup(null);
    setHoveredListPlanet(null);
    isPausedRef.current = false;
  };

  /* -----------------------------------------------------
     Return System
  ----------------------------------------------------- */
  return {
    containerRef,
    planetsRef,
    labelRefs,
    isPausedRef,
    nextId,

    planetList,
    hoveredListPlanet,
    popupOpen,
    mediaPopup,
    mediaAddPopup,

    inputName,
    inputFile,
    inputTag,
    tags,
    description,
    location,

    mediaDescription,
    mediaLocation,

    fileInputRef,

    setPlanetList,
    setHoveredListPlanet,
    setPopupOpen,
    setMediaPopup,
    setMediaAddPopup,
    setInputName,
    setInputFile,
    setInputTag,
    setTags,
    setDescription,
    setLocation,
    setMediaDescription,
    setMediaLocation,

    deletePlanet,
    deleteMediaFromPlanet,
    addPlanet,
    addMediaToPlanet,
    openMediaAddPopupForPlanet,
    handleFileChange,
    closeAddPopup,
    closeMediaPopup,

    toggleLike,
    toggleStar,
    reportMedia,
  };
}