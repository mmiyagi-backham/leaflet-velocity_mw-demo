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
  // marker
  var littleton = L.marker([39.61, -105.02]).bindPopup(
      "This is Littleton, CO."
    ),
    denver = L.marker([39.74, -104.99]).bindPopup("This is Denver, CO."),
    aurora = L.marker([39.73, -104.8]).bindPopup("This is Aurora, CO."),
    golden = L.marker([39.77, -105.23]).bindPopup("This is Golden, CO.");

  var cities = L.layerGroup([littleton, denver, aurora, golden]);

  // wind
  var littleton = L.marker([39.61, -105.02]).bindPopup(
      "This is Littleton, CO."
    ),
    denver = L.marker([39.74, -104.99]).bindPopup("This is Denver, CO."),
    aurora = L.marker([39.73, -104.8]).bindPopup("This is Aurora, CO."),
    golden = L.marker([39.77, -105.23]).bindPopup("This is Golden, CO.");

  var velocityLayer;
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
    console.log(" - velocityLayer hampton", velocityLayer);
    // layerControl.addOverlay(velocityLayer, "HarbarCenter-Hampton, VA");
    // 初期表示時から風を表示する。
  });

  if (velocityLayer) {
    // TODO 風が表示できているか確認する。
    console.log(" - velocityLayer", velocityLayer);
    var wind = L.layerGroup([velocityLayer]);
  }

  var baseLayers = {
    Satellite: Esri_WorldImagery,
    "Grey Canvas": Esri_DarkGreyCanvas,
    OSM: Metro_OSM,
  };

  var overlayMaps = {
    Cities: cities,
    Wind: wind,
  };

  var map = L.map("map", {
    layers: [Esri_WorldImagery, cities, wind], // デフォルトチェックするレイヤー
    zoomControl: false, // デフォルト表示のズーム：非表示
  });

  // 第一引数:baseLayers, 第二引数:overlayMaps
  var layerControl = L.control.layers(baseLayers, overlayMaps);
  console.log("- layerControl", layerControl, "- map", map);
  layerControl.addTo(map);
  map.setView([37, -76], 10);
  L.control.zoom({ position: "topright" }).addTo(map);

  return {
    map: map,
    layerControl: layerControl,
  };
}

// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map;
var layerControl = mapStuff.layerControl;

$.getJSON("wind-gbr.json", function (data) {
  var velocityLayer = L.velocityLayer({
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

  layerControl.addOverlay(velocityLayer, "Wind - Great Barrier Reef");
});

// $.getJSON("./water-gbr.json", function (data) {
$.getJSON("water-gbr.json", function (data) {
  var velocityLayer = L.velocityLayer({
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

  layerControl.addOverlay(velocityLayer, "Ocean Current - Great Barrier Reef");
});

// $.getJSON("./wind-global.json", function (data) {
$.getJSON("wind-global.json", function (data) {
  var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "Global Wind",
      position: "bottomleft",
      emptyString: "No wind data",
    },
    data: data,
    maxVelocity: 15,
  });

  layerControl.addOverlay(velocityLayer, "Wind - Global");
});

// $.getJSON("./hampton.json", function (data) {
$.getJSON("hampton.json", function (data) {
  var velocityLayer = L.velocityLayer({
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
  console.log(" - velocityLayer hampton", velocityLayer);
  layerControl.addOverlay(velocityLayer, "HarbarCenter-Hampton, VA");
  // 初期表示時から風を表示する。
  // velocityLayer.onAdd(map);
});

// $.getJSON("./retreat_center.json", function (data) {
$.getJSON("retreat_center.json", function (data) {
  var velocityLayer = L.velocityLayer({
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

  layerControl.addOverlay(velocityLayer, "RetreatCenter-Hampton, VA");
});

// $.getJSON("./leatest.json", function (data) {
$.getJSON("leatest.json", function (data) {
  var velocityLayer = L.velocityLayer({
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

  layerControl.addOverlay(velocityLayer, "Hampton-AD4, VA");
});
