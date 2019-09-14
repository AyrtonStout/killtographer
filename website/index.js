const allMaps = {
  'Azeroth': 947,
  'Durotar': 1411,
  'Mulgore': 1412,
  'The Barrens': 1413,
  'Kalimdor': 1414,
  'Eastern Kingdoms': 1415,
  'Alterac Mountains': 1416,
  'Arathi Highlands': 1417,
  'Badlands': 1418,
  'Blasted Lands': 1419,
  'Tirisfal Glades': 1420,
  'Silverpine Forest': 1421,
  'Western Plaguelands': 1422,
  'Eastern Plaguelands': 1423,
  'Hillsbrad Foothills': 1424,
  'The Hinterlands': 1425,
  'Dun Morogh': 1426,
  'Searing Gorge': 1427,
  'Burning Steppes': 1428,
  'Elwynn Forest': 1429,
  'Deadwind Pass': 1430,
  'Duskwood': 1431,
  'Loch Modan': 1432,
  'Redridge Mountains': 1433,
  'Stranglethorn Vale': 1434,
  'Swamp of Sorrows': 1435,
  'Westfall': 1536,
  'Wetlands': 1437,
  'Teldrassil': 1438,
  'Darkshore': 1439,
  'Ashenvale': 1440,
  'Thousand Needles': 1441,
  'Stonetalon Mountains': 1442,
  'Desolace': 1443,
  'Feralas': 1444,
  'Dustwallow Marsh': 1445,
  'Tanaris': 1446,
  'Azshara': 1447,
  'Felwood': 1448,
  "Un'goro Crater": 1449,
  'Moonglade': 1450,
  'Silithus': 1451,
  'Winterspring': 1452,
  'Stormwind City': 1453,
  'Orgrimmar': 1454,
  'Ironforge': 1455,
  'Thunder Bluff': 1456,
  'Darnassus': 1457,
  'Undercity': 1458,
  'Alterac Valley': 1459,
  'Warsong Gulch': 1460,
  'Arathi Basin': 1461
};

let currentMapData = null;
let currentMapId = null;
let previousMaps = [];

function loadMap(mapId, pushPreviousMap) {
  if (pushPreviousMap) {
    previousMaps.push(currentMapId);
  }

  currentMapData = maps[mapId];
  currentMapId = mapId;

  const imgEl = document.getElementById('viewed-map');
  imgEl.style.backgroundImage = `url("./maps/${mapId}.jpg")`;

  const svgEl = document.getElementById('map-svg');

  while (svgEl.hasChildNodes()) {
    svgEl.firstChild.remove();
  }

  if (!currentMapData) {
    return;
  }

  currentMapData.forEach(mapLink => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.onclick = () => loadMap(mapLink.goesTo, true);
    path.setAttribute('d',  mapLink.coordinates);

    svgEl.append(path);
  });

}

window.addEventListener('contextmenu', e => {
  e.preventDefault();

  if (previousMaps.length === 0) {
    return;
  }

  loadMap(previousMaps.pop(), false);
});


loadMap(947, false);
