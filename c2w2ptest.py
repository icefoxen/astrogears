#!/usr/bin/env python
# -*- coding: utf-8 -*-
#Clockgear.py

import time, sys
#time may not be accurate in windows
start = time.time()  # save the current time 

Target_gear_range = 1.002737909350795
error_limit = .000003
#print to file True or False uncomment(#) true to print
prt2file = False
#prt2file = True
filename = "gear2_70.csv"
#wheels starting & ending numbers
w1 = 50.
endw = 80.
#pinions starting and ending numbers
p1 = 85.
endp = 45.

tot_cnt = 0
delta_cnt = 0
data = []

wheel1 = w1
pinion1 = p1
while (wheel1 < endw):
    wheel2 = wheel1
    pinion1 = p1
    pinion2 = p1
    while (wheel2 < endw):
        pinion1 = p1
        pinion2 = p1
        while (pinion1 > endp):
            pinion2 = pinion1
            while (pinion2 > endp):
                calc_ratio = (wheel1 / pinion1 ) * (wheel2 / pinion2)
                tot_cnt = tot_cnt + 1
                #print calc_ratio, wheel1, wheel2, pinion1, pinion2
                #Calculated delta difference from target & current calc
                delta = (calc_ratio -Target_gear_range)
                delta_abs = abs(delta)
                if delta_abs < error_limit:
                    data.append((calc_ratio, delta, wheel1, wheel2, pinion1, pinion2))
                    delta_cnt = delta_cnt + 1
                pinion2 = pinion2 - 1
                continue
            pinion1 = pinion1 - 1
            continue
        wheel2 = wheel2 + 1
        continue
    wheel1 = wheel1 + 1
    continue

if prt2file:
    saveout = sys.stdout
    fsock = open(filename, 'w')
    sys.stdout = fsock 

print " "    
print "Target Gear Range= %.10f %.10f" % (Target_gear_range,  error_limit)


data.sort()
for line in data:
    print "data w1-2,p1-2: ", line
    pass  

print " "

print "Total Count =", tot_cnt
print "Delta Count =", delta_cnt
print "\a"  

elapsed_sec = time.time() - start
print "Calculation took %f seconds" % elapsed_sec
#(10 hours, 40 minutes, 34.944842 seconds)

elapsed_readable = time.strftime("%H:%M:%S", time.gmtime(elapsed_sec))
print "Elapsed time (HH:MM:SS):", elapsed_readable
print "done"

if prt2file:
    sys.stdout = saveout
    fsock.close()
    fsock = open(filename, 'r')
    print fsock
    fsock.close()
