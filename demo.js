async function initDemoMap() {
  var Esri_WorldImagery = L.tileLayer(
    "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, " +
        "AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  );

  var Esri_DarkGreyCanvas = L.tileLayer(
    "http://{s}.sm.mapstack.stamen.com/" +
      "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
      "{z}/{x}/{y}.png",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, " +
        "NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
    }
  );
  // MetroWeather用Map
  var Metro_OSM = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  /* overlayMaps **/
  let hcHamptonLayer = await getHcHamptonLayer();
  var windLayerGroup = L.layerGroup([hcHamptonLayer]);
  const hcHamptonLayerName = "HarbarCenter-Hampton, VA";

  var baseLayers = {
    Satellite: Esri_WorldImagery,
    "Grey Canvas": Esri_DarkGreyCanvas,
    OSM: Metro_OSM,
  };

  var map = L.map("map", {
    layers: [Esri_WorldImagery, windLayerGroup], // デフォルトチェックするレイヤー
    zoomControl: false, // デフォルト表示のズーム：非表示
  });

  // 第一引数:baseLayers, 第二引数:overlayMaps
  var layerControl = L.control.layers(baseLayers);
  console.log("- layerControl", layerControl, "- map", map);
  layerControl.addTo(map);
  // map.setView([37, -76], 10); // 提供時の座標
  map.setView([37, -76.35], 11); // 改修時の座標調整
  L.control.zoom({ position: "topright" }).addTo(map);

  // レイヤーの追加
  let windGbrLayer = await getWindGbrLayer();
  layerControl.addOverlay(windGbrLayer, "Wind - Great Barrier Reef");
  let waterGbrLayer = await getWaterGbrLayer();
  layerControl.addOverlay(waterGbrLayer, "Ocean Current - Great Barrier Reef");
  let rcHamptonLayer = await getRcHamptonLayer();
  layerControl.addOverlay(rcHamptonLayer, "RetreatCenter-Hampton, VA");
  let windGlobalLayer = await getWindGlobalLayer();
  layerControl.addOverlay(windGlobalLayer, "Wind - Global");
  layerControl.addOverlay(hcHamptonLayer, hcHamptonLayerName);
  let leatestLayer = await getLeatestLayer();
  layerControl.addOverlay(leatestLayer, "Hampton-AD4, VA");

  return {
    map: map,
    layerControl: layerControl,
  };
}

// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map;
var layerControl = mapStuff.layerControl;

// Wind - Great Barrier Reef
async function getWindGbrLayer() {
  let velocityLayer;
  await $.getJSON("wind-gbr.json", function (data) {
    velocityLayer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: "GBR Wind",
        position: "bottomleft",
        emptyString: "No wind data",
        showCardinal: true,
      },
      data: data,
      maxVelocity: 10,
    });
  });
  return velocityLayer;
}

// Ocean Current - Great Barrier Reef
async function getWaterGbrLayer() {
  let velocityLayer;
  await $.getJSON("water-gbr.json", function (data) {
    velocityLayer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: "GBR Water",
        position: "bottomleft",
        emptyString: "No water data",
      },
      data: data,
      maxVelocity: 0.6,
      velocityScale: 0.1, // arbitrary default 0.005
    });
  });
  return velocityLayer;
}

// Wind - Global
async function getWindGlobalLayer() {
  let velocityLayer;
  await $.getJSON("wind-global.json", function (data) {
    velocityLayer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: "Global Wind",
        position: "bottomleft",
        emptyString: "No wind data",
      },
      data: data,
      maxVelocity: 15,
    });
  });
  return velocityLayer;
}

// HarbarCenter-Hampton, VA
async function getHcHamptonLayer() {
  let velocityLayer;
  await $.getJSON("hampton.json", function (data) {
    velocityLayer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: "Global Wind",
        position: "bottomleft",
        emptyString: "No wind data",
      },
      data: data,
      minVelocity: 5,
      maxVelocity: 28,
      velocityScale: 0.001,
      opacity: 0.1, //透過率(1が最大)
      showCardinal: true,
    });
  });
  return velocityLayer;
}

// RetreatCenter-Hampton, VA
async function getRcHamptonLayer() {
  let velocityLayer;
  await $.getJSON("retreat_center.json", function (data) {
    velocityLayer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: "Global Wind",
        position: "bottomleft",
        emptyString: "No wind data",
      },
      data: data,
      minVelocity: 0,
      maxVelocity: 20,
      velocityScale: 0.001,
      opacity: 0.1, //透過率(1が最大)
    });
  });
  return velocityLayer;
}

// Hampton-AD4, VA
async function getLeatestLayer() {
  let velocityLayer;
  await $.getJSON("leatest.json", function (data) {
    velocityLayer = L.velocityLayer({
      displayValues: true,
      displayOptions: {
        velocityType: "Global Wind",
        position: "bottomleft",
        emptyString: "No wind data",
      },
      data: data,
      minVelocity: 0,
      maxVelocity: 20,
      velocityScale: 0.001,
      opacity: 0.1, //透過率(1が最大)
    });
  });
  return velocityLayer;
}
