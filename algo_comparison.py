#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# Based on c2w2ptest.py
# Try out ways of simplifying the nested while loops
# and making sure it repeats the values of the original
# algorithm.

import time, sys

Target_gear_range = 1.002737909350795
error_limit = .000003

#wheels starting & ending numbers
w1 = 45
endw = 100
#pinions starting and ending numbers
p1 = 100
endp = 45

data = []

def gear_ratio(lst):
    """
    Takes a list of (wheel,pinion) tuples and calculates the
    gear ratio for them.
    """

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
                #Calculated delta difference from target & current calc
                delta = (calc_ratio -Target_gear_range)
                delta_abs = abs(delta)
                if delta_abs < error_limit:
                    data.append((calc_ratio, delta, wheel1, wheel2, pinion1, pinion2))
                pinion2 = pinion2 - 1
            pinion1 = pinion1 - 1
        wheel2 = wheel2 + 1
    wheel1 = wheel1 + 1

print()
print("Target Gear Range= %.10f %.10f" % (Target_gear_range,  error_limit))


data.sort()
for line in data:
    print("data w1-2,p1-2: ", line)

print()


# Replace janky while loops with for loops
data = []
for wheel1 in range(w1, endw+1):
   for wheel2 in range(wheel1, endw+1):
      for pinion1 in range(p1, endp, -1):
         for pinion2 in range(pinion1, endp, -1):
                calc_ratio = (wheel1 / pinion1 ) * (wheel2 / pinion2)
                #Calculated delta difference from target & current calc
                delta = (calc_ratio -Target_gear_range)
                delta_abs = abs(delta)
                if delta_abs < error_limit:
                    data.append((calc_ratio, delta, wheel1, wheel2, pinion1, pinion2))


print()
print("Target Gear Range= %.10f %.10f" % (Target_gear_range,  error_limit))


data.sort()
for line in data:
    print("data w1-2,p1-2: ", line)

print()


# Replace obscure count-down pinion loops with count-up ones
data = []
for wheel1 in range(w1, endw+1):
   for wheel2 in range(wheel1, endw+1):
      for pinion1 in range(endp, p1):
         for pinion2 in range(endp, pinion1):
                calc_ratio = (wheel1 / pinion1) * (wheel2 / pinion2)
                #Calculated delta difference from target & current calc
                delta = (calc_ratio -Target_gear_range)
                delta_abs = abs(delta)
                if delta_abs < error_limit:
                    data.append((calc_ratio, delta, wheel1, wheel2, pinion1, pinion2))


print()
print("Target Gear Range= %.10f %.10f" % (Target_gear_range,  error_limit))


data.sort()
for line in data:
    print("data w1-2,p1-2: ", line)

print()


