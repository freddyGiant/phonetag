from flask import Flask, render_template
from math import *

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


def tagHitCheck(P1x, P1y, P1aim, P2x, P2y): #Returns true if the 2nd player is in the area that player 1 should tag at
    #aim should be radians on the unit cicle
    #constants
    positionalLeniancyRadius = 10 #meters
    targetingDistance = 75
    targetingAngleLeniancy = pi/6 #degrees

    if (2*positionalLeniancyRadius)**2 >= (P1x-P2x)**2 + (P1y-P2y)**2 : #checks circle around player
        return True
    else:
        distanceToAimingPoint = positionalLeniancyRadius* 1/sin(targetingAngleLeniancy)
        xAimingPoint = P1x - distanceToAimingPoint*cos(P1aim)
        yAimingPoint = P1y - distanceToAimingPoint*sin(P1aim)

        distanceX = P2x-xAimingPoint
        distanceY = P2y-yAimingPoint

        if((targetingDistance+2*positionalLeniancyRadius+distanceToAimingPoint)**2 >= distanceX**2 + distanceY**2 and distanceToAimingPoint**2 <= distanceX**2 + distanceY**2):
            if distanceX == 0:
                if distanceY>0:
                    directionToP2 = pi/2
                else:
                    directionToP2 = 3*pi/2
            else:
                directionToP2 = atan(distanceY/distanceX)
                if distanceX <0:
                    directionToP2+=pi 
            if directionToP2 < 0:
                directionToP2 += 2*pi
            deltaAngle = abs(P1aim-directionToP2)
            if deltaAngle>180:
                deltaAngle = 360 - deltaAngle
            if deltaAngle <= targetingAngleLeniancy:
                return True

    return False




if __name__ == '__main__':
    app.run(debug=True)