const build = true; // true if build, false if neu run

let lati = 47.507064;
let long = 19.045645;
let z = 10;
await Neutralino.init();


let basePath;
if (build) {
  basePath = await Neutralino.filesystem.getAbsolutePath("./");
} else {
  basePath = await Neutralino.filesystem.getAbsolutePath("./resources");
}

const configPath = `${basePath}/SysSettings.json`;
const fileContent = await Neutralino.filesystem.readFile(configPath);
const config = JSON.parse(fileContent);
const apikey = config.MapApiKey;

console.log("Mapbox API key loaded");

const zoomSlider = document.getElementById("setZoom");
const zoomDisplay = document.getElementById("ZoomDisplay");
const img = document.querySelector("img");


zoomSlider.value = z;
zoomDisplay.textContent = z;

zoomSlider.addEventListener("input", () => {
  z = Number(zoomSlider.value);
  zoomDisplay.textContent = z;
});

zoomSlider.addEventListener("change", () => {
  console.log(`Zoom updated to ${z}`);
  getMap();
});

document.getElementById("fetchBtn").onclick = getMap;
document.getElementById("errTest").onclick = testEndpoint;


async function getMap() {
  let defaultValue = false;
  console.log(document.getElementById("LAT").textContent !="" && document.getElementById("LON").textContent != "");
  if(document.getElementById("LAT").textContent != "" && document.getElementById("LON").textContent != ""){
  lati = document.getElementById("LAT").textContent;
  lati = lati.substring(5)
  long = document.getElementById("LON").textContent;
  long = long.substring(5)
  }
  else{defaultValue = true;}
  const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${long},${lati},${z},0,0/400x400?access_token=${apikey}`;
  console.log("url: ", url);

  const response = await fetch(url);
  const blob = await response.blob();
  img.src = URL.createObjectURL(blob);

  updateDisplay(defaultValue);
}

function updateDisplay(defaultValue) {
  if(!defaultValue){
  document.getElementById("latitude").textContent = `lat: ${lati}`;
  document.getElementById("longitude").textContent = `lon: ${long}`;
  }
  else{
  document.getElementById("latitude").textContent = `lat: ${lati} [TEST VALUE]`;
  document.getElementById("longitude").textContent = `lon: ${long} [TEST VALUE]`;
  }
  console.log("Latitude & longitude updated");
}

function testEndpoint() {
  const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${long},${lati},${z},0,0/400x400?access_token=${apikey}`;

  const testImg = new Image();
  testImg.onload = () => {
    console.log("Mapbox API reachable");
    console.log(testImg);
    alert("Mapbox API connection functioning");
  };
  testImg.onerror = (err) => {
    console.error("Mapbox API error", err);
    alert("Mapbox API error");
  };
  testImg.src = url;
}
