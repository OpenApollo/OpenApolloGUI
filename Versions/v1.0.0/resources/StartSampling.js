const build = true; //True if doing build, False if running via 'neu run'

await Neutralino.init()
import { runshunt } from "./ShuntValDisplay.js";

let path;
if(build == true){
path = await Neutralino.filesystem.getAbsolutePath('./'); //Get full windows path to folder
}
else{
path = await Neutralino.filesystem.getAbsolutePath('./resources'); //Get full windows path to folder
}
const pythonpath = (`${path}/SerialRead.py`);

document.getElementById("startSampling").onclick = async function runsample(){
console.log("StartSampling.js called");

console.log("ShuntValDisplay.js function called");
runshunt();


let info = Neutralino.os.execCommand(`python ${pythonpath}`);
console.log(`SerialRead.py called with path: ${pythonpath}`);
console.log(`cmd stdout on python call: ${info.stdOut}`);
}

