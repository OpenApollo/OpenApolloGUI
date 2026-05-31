import serial
import pathlib
import json
import time
import asyncio
import websockets
import math
from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosedOK


BUILD = True #True if doing build, False if running via 'neu run'
JsonDataGlobal={"A:","A:"}

print(serial.__file__)

#Get json config
abspath = (pathlib.Path().absolute())
if(BUILD == False):
    jsonpath = str(abspath) + r"\resources\SysSettings.json"
    Datajsonpath = str(abspath) + r".\resources"
elif(BUILD == "Test"):
    jsonpath = r"c:\Users\totht\Desktop\C++_projects\OpenApollo_GUI\resources\SysSettings.json"
    Datajsonpath = r"c:\Users\totht\Desktop\C++_projects\OpenApollo_GUI\resources"
else:
    jsonpath = str(abspath) +r"\SysSettings.json"
    Datajsonpath = str(abspath)
with open(str(jsonpath), "r") as file:
    SerConfig = json.load(file)

print(Datajsonpath)
print(SerConfig['InputComPort'])

time.sleep(2)

#Because I have an issue where it only works like half the time. I guess it's some kind of race condition
for attempt in range(10): 
    try:
        ser = serial.Serial(
            port=SerConfig['InputComPort'],
            baudrate=SerConfig['InputBaudRate'],
            parity=serial.PARITY_ODD,
            stopbits=serial.STOPBITS_TWO,
            bytesize=serial.SEVENBITS
        )
        break
    except Exception as e:
        print(f"Attempt {attempt+1} failed: {e}")
        time.sleep(1)
else:
    raise RuntimeError("Could not open serial port after 10 attempts")
print("Set up")

serlist = []
gpslist = [None]*7
knotSpeed = 0.1
mSpeed = 0.1
kSpeed = 0.1
machSpeed = 0.1
sensordata = {}
gps_data = {}
imu_data = {}
baro_data = {}

print("Declared")

asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
async def serialRead(websocket): 

    while True:
        print("In loop")

        data = ser.readline().decode("utf-8", errors="ignore").strip()

        if not data:
            continue

        # GPS parsing
        if data.startswith("$GNRMC"):
            print("gpsparse")
            fields = data.split(',')

            try:
                if fields[2] == 'A':  # valid GPS fix


                    gps_data["HEADING"] = float(fields[8]) if fields[8] else None

                    gpslist = [
                        gps_data.get("HEADING")
                    ]

            except (IndexError, ValueError):
                continue

        # Sensor parsing
        else:
            parts = data.split()

            for part in parts:
                if ":" in part:
                    key, value = part.split(":", 1)
                    key = key.lstrip("#")

                    try:
                        value = float(value)
                    except ValueError:
                        pass

                    # route by type
                    if key in ["TEMP", "P"]:
                        baro_data[key] = value
                    else:
                        imu_data[key] = value

        # Compute onlz when ready
        required_imu = {"GyroX", "GyroY", "GyroZ", "quatI", "quatJ", "quatK", "quatW"}
        required_baro = {"TEMP", "P"}

        if required_imu.issubset(imu_data.keys()) and required_baro.issubset(baro_data.keys()):

            print("enData")

            T = baro_data["TEMP"]
            T /= 100
            P = baro_data["P"]

            altitudeCalc = ((287 * (T + 273.15)) / 9.81) * math.log(101325 / P)
            if(fields[8] != ''):
                headingVar = str(float(fields[8]))
            else:
                headingVar = ''
            

            JsonDataGlobal = {
                "UTC": fields[1],
                "LAT": str((float(fields[3]) / 100)),
                "LONG": str((float(fields[5]) / 100)),
                "KMH": str((float(fields[7]) * 1.852)),
                "MS": str((float(fields[7]) * 0.514444)),
                "MACH": str((float(fields[7]) / 661.46753)), 
                "HEADING": headingVar,

                "gX": imu_data.get("GyroX"),
                "gY": imu_data.get("GyroY"),
                "gZ": imu_data.get("GyroZ"),

                "qI": imu_data.get("quatI"),
                "qJ": imu_data.get("quatJ"),
                "qK": imu_data.get("quatK"),
                "qW": imu_data.get("quatW"),

                "TEMP": T,
                "PRES": P,
                "ALT": altitudeCalc
            }

            print(JsonDataGlobal)

            #reset IMU+baro to get fresh frames
            imu_data.clear()
            baro_data.clear()

            print(JsonDataGlobal)
            sensordata.clear()
            ser.close() #Close so buffer doesn't accumulate (otherwise it might give old results)
                        
            await websocket.send(json.dumps(JsonDataGlobal, indent=4))
            print(f"Sending: >>> {JsonDataGlobal}")

            with open(jsonpath, "r") as file: #Get refresh frequency from json
                SerConfig = json.load(file)
            time.sleep(int(SerConfig['RefreshFrequency'])) #sleep so JS has time to read the json

            print(serlist)
            serlist.clear()
            ser.open() #Reopen



async def main():
    async with serve(serialRead, "localhost", 8765) as server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())


# $GNRMC,154545.00,A,4741.38397,N,01634.42680,E,0.060,,060426,,,A,V*18
# #GyroX:0 #GyroY:0 #GyroZ:0
# #quatI:-465 #quatJ:-65 #quatK:-97 #quatW:16377
# UNKNOWN_REPORT: 0x03 offset:19
# #quatI:-465 #quatJ:-65 #quatK:-97 #quatW:16377
# #GyroX:0 #GyroY:0 #GyroZ:0
# #quatI:-465 #quatJ:-65 #quatK:-97 #quatW:16377
# UNKNOWN_REPORT: 0x03 offset:29
# #TEMP:2576 #P:99404

