
OpenApollo telemetry GUI v1.0.0

Based on NeutralinoJS; **only tested on x86-64 Windows**

Originally made by @ReTTr0c for OpenApollo V1

-------------------------------------------------------------------------------------
Dependencies:

Python

PySerial (and serial?)

Websockets

Node.Js

-------------------------------------------------------------------------------------

Warnings:
Do not remove "filesystem.*" from nativeAllowList in neutralino.config.json
Keep "enableNativeAPI": true in neutralin.config.json

**After setting up Mapbox API account, create custom token with all URLs allowed and use that key.
Just click on create token, give it a name and change nothing else. As of Feb, 2026 it will
allowe requests from any URL be default. Not doing this will make the map fetch not work due to
NeutralinoJS stuff.**
