import serial
from time import sleep

ser = serial.Serial(
    port='COM5', #From .json
    baudrate=9600, #From .json
)

for c in range (5):
    ser.write(b"ARMWS\0")
    sleep(0.5)

    #Zero_Servos_POS/NEG?