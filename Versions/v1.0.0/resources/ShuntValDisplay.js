const build = true; //True if doing build, False if running via 'neu run'

await Neutralino.init(); 
let fullpath;
let path;
if(build == true){
path = await Neutralino.filesystem.getAbsolutePath('./'); //Get full windows path to folder
fullpath = (`${path}/SerialData.json`); //Full path to .json
}
else{
path = await Neutralino.filesystem.getAbsolutePath('./'); //Get full windows path to folder
fullpath = (`${path}/SerialData.json`); //Full path to .json
}
console.log(`Full: ${fullpath}`);

export async function runshunt(){
console.log("ShuntValDisplay.js function started");
const ws = new WebSocket("ws://localhost:8765/"); //setup WebSocket

ws.onmessage = (event) => { //WS event listener (SerialRead.py pushes)
  let data = JSON.parse(event.data);

const now = new Date();
console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()} Data received`);

let utc = data.UTC;
let lat = data.LAT;
let lon = data.LONG;
let kmh = data.KMH;
let ms = data.MS;
let mach = data.MACH;
let head = data.HEADING;
let gx = data.gX;
let gy = data.gY;
let gz = data.gZ;
let qI = data.qI;
let qJ = data.qJ;
let qK = data.qK;
let qW = data.qW;
let temp = data.TEMP;
let press = data.PRES;
let alt = data.ALT;

document.getElementById("UTC").textContent = `UTC: ${utc}`;
document.getElementById("LAT").textContent = `LAT: ${lat}`;
document.getElementById("LON").textContent = `LON: ${lon}`;
document.getElementById("KM").textContent = `Speed: ${kmh} Km/h`;
document.getElementById("M").textContent = `Speed: ${ms} m/s`;
document.getElementById("MA").textContent = `Speed: ${mach} Mach`;
document.getElementById("HEAD").textContent = `Heading: ${head} degrees`;
document.getElementById("X").textContent = `Gyro X: ${gx} rad/s`;
document.getElementById("Y").textContent = `Gyro Y: ${gy} rad/s`;
document.getElementById("Z").textContent = `Gyro Z: ${gz} rad/s`;
document.getElementById("I").textContent = `Quat I: ${qI}`;
document.getElementById("J").textContent = `Quat J: ${qJ}`;
document.getElementById("K").textContent = `Quat K: ${qK}`;
document.getElementById("W").textContent = `Quat W ${qW}`;
document.getElementById("TEMP").textContent = `Temperature: ${temp} C`;
document.getElementById("PRESS").textContent = `Pressure: ${press} Pa`;
document.getElementById("ALT").textContent = `Altitude: ${alt} m`;



}
}

document.getElementById("ARMSERVO").onclick = async function(){
  console.log("ARMWS");
}
document.getElementById("ARMNOSERVO").onclick = async function(){
  console.log("ARMNS");
}
document.getElementById("DISARM").onclick = async function(){
console.log("DISARM")
}
document.getElementById("LAUNCH").onclick = async function(){
console.log("LAUNCH")
}
