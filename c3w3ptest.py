#!/usr/bin/env python
# -*- coding: utf-8 -*-
#Clockgear.py

import time, sys
#time may not be accurate in windows
start = time.time()  # save the current time 

Target_gear_range = 1.002737909350795
error_limit = .0000003
#print to file True or False uncomment(#) true  to print
#prt2file = False
prt2file = True
filename = "gear3_70.csv"
#wheels starting & ending numbers
w1 = 40.
endw =61.
#pinions starting and ending numbers
p1 = 85.
endp = 65.

tot_cnt = 0
delta_cnt = 0
data = []

wheel1 = w1
pinion1 = p1
while (wheel1 < endw):
    wheel2 = wheel1
    wheel3 = wheel1
    pinion1 = p1
    pinion2 = pinion1
    pinion3 = pinion1
    while (wheel2 < endw):
        wheel3 = wheel2
        pinion1 = p1
        pinion2 = pinion1
        pinion3 = pinion1
        while (wheel3 < endw):
            pinion1 = p1
            pinion2 = pinion1
            pinion3 = pinion1           
            while (pinion1 > endp):
                pinion2 = pinion1
                pinion3 = pinion1  
                while (pinion2 > endp):
                    pinion3 = pinion2
                    while (pinion3 > endp):
                        calc_ratio = (wheel1/pinion1) * (wheel2/pinion2) * (wheel3/pinion3)
                        tot_cnt = tot_cnt + 1
                        #print calc_ratio, wheel1, wheel2, wheel3, pinion1, pinion2, pinion3
                        #Calculated delta difference from target & current calc
                        delta = abs(calc_ratio -Target_gear_range)
                        delta_abs = abs(delta)
                        if delta_abs < error_limit:
                            data.append((calc_ratio, delta, wheel1, wheel2, wheel2, pinion1, pinion2, pinion3))
                            delta_cnt = delta_cnt + 1
                        pinion3 = pinion3 - 1
                        continue
                    pinion2 = pinion2 - 1
                    continue
                pinion1 = pinion1 - 1
                continue
            wheel3 = wheel3 + 1
            continue
        wheel2 = wheel2 + 1   
        continue
    wheel1 = wheel1 + 1
    elapsed = time.time() - start 
    #print "Calculation took %f seconds" % elapsed
    print "wheel1: ", wheel1, " Calculation took %f seconds" % elapsed
    
    continue

if prt2file:
    saveout = sys.stdout
    fsock = open(filename, 'w')
    sys.stdout = fsock 

print " "    
print "Target Gear Range= %.10f %.10f" % (Target_gear_range,  error_limit)

data.sort()
for line in data:
    print "data w1-3,p1-3: ", line
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
