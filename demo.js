function initDemoMap() {
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

  var baseLayers = {
    Satellite: Esri_WorldImagery,
    "Grey Canvas": Esri_DarkGreyCanvas,
  };

  var map = L.map("map", {
    layers: [Esri_WorldImagery],
    zoomControl: false, // デフォルト表示のズーム：非表示
  });

  var layerControl = L.control.layers(baseLayers);
  console.log("- layerControl", layerControl, "- map", map);
  layerControl.addTo(map);
  // layerControl.zoom({position: 'bottomright'});
  // map.setView([-22, 150], 5); // origin - オーストラリア
  // map.setView([35.683361, 139.756612], 16); // demo - tokyo
  map.setView([34.9336090088, 135.7737426758], 9); // demo - 滋賀県の比良駅周辺
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

// load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)
// work - str
// $.getJSON("demo_work.json", function (data) {
//   var velocityLayer = L.velocityLayer({
//     displayValues: true,
//     displayOptions: {
//       velocityType: "GBR Wind",
//       position: "bottomleft",
//       emptyString: "No wind data",
//       showCardinal: true,
//     },
//     data: data,
//     maxVelocity: 10,
//   });

//   layerControl.addOverlay(velocityLayer, "Wind - 気象庁 局地モデル 日本");
// });

$.getJSON("wrfout_d01_2021-03-02_00_00_00.json", function (data) {
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

  layerControl.addOverlay(velocityLayer, "Wind - wrfout 日本");
});
// work - end

// $.getJSON("wind-gbr.json", function(data) {
//   var velocityLayer = L.velocityLayer({
//     displayValues: true,
//     displayOptions: {
//       velocityType: "GBR Wind",
//       position: "bottomleft",
//       emptyString: "No wind data",
//       showCardinal: true
//     },
//     data: data,
//     maxVelocity: 10
//   });

//   layerControl.addOverlay(velocityLayer, "Wind - Great Barrier Reef!");
// });

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
