const build = true; //True if doing build, False if running via 'neu run'

let fullpath; //I'm sorry for making these global
let path;

displaysettings();

async function displaysettings(){
    await Neutralino.init();
    if(build == true){
      path = await Neutralino.filesystem.getAbsolutePath('./'); //Get full windows path to folder
      fullpath = (`${path}/SysSettings.json`); //Full path to .json
    }
    else{
    path = await Neutralino.filesystem.getAbsolutePath('./resources'); //Get full windows path to folder
    fullpath = (`${path}/SysSettings.json`); //Full path to .json
    }

    console.log(`Fetching json data to display with path ${fullpath}`);
    let fileContent = await Neutralino.filesystem.readFile(fullpath); //get .json content
    let config = JSON.parse(fileContent);
    let apikeydisp = config.MapApiKey;
    let comportdisp = config.InputComPort;
    let baudratedisp = config.InputBaudRate;
    let reffreqdisp = config.RefreshFrequency;
    console.log("Json data fetched");

    console.log("Refreshing settings display");
    document.getElementById("APIKEYDISP").textContent = `API key: ${apikeydisp}`;
    document.getElementById("COMPORTDISP").textContent = `COM port: ${comportdisp}`;
    document.getElementById("BAUDRATEDISP").textContent = `Baud rate: ${baudratedisp}`;
    document.getElementById("REFFREQDISP").textContent = `Refresh frequency (s): ${reffreqdisp}`;
    console.log("Settings display refreshed");
}

document.getElementById("SaveConfig").onclick = async function(){ 
await Neutralino.init(); 
if(build == true){
  path = await Neutralino.filesystem.getAbsolutePath('./'); //Get full windows path to folder
  fullpath = (`${path}/SysSettings.json`); //Full path to .json
}
else{
path = await Neutralino.filesystem.getAbsolutePath('./resources'); //Get full windows path to folder
fullpath = (`${path}/SysSettings.json`); //Full path to .json
}
    
    //Get values from config.html
    console.log("Getting values from config.html text input fields")
    let apikey = document.getElementById("APIKEY").value;
    let comport = document.getElementById("COMPORT").value;
    let baudrate = document.getElementById("BAUDRATE").value;
    let reffreq = document.getElementById("REFFREQ").value;

    //Open json
    let read = await Neutralino.filesystem.readFile(fullpath);
    let settings = JSON.parse(read);

    //Set config only if not left empty
    if(apikey != ""){settings.MapApiKey = apikey;}
    if(comport !=""){settings.InputComPort = comport;}
    if(baudrate != ""){settings.InputBaudRate = baudrate;}
    if(reffreq != ""){settings.RefreshFrequency = reffreq;}

    //Write json
    console.log(`Writing to json with path ${fullpath}`);
    await Neutralino.filesystem.writeFile(fullpath, JSON.stringify(settings, null, 4)); //Write data
    console.log("Json written; refreshing settings display");

    displaysettings();

}