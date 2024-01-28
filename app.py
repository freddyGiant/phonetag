from flask import Flask, render_template, request
from flask_socketio import SocketIO
from math import *
import json
import uuid

app = Flask(__name__)
io = SocketIO(app)

@app.route('/')
def home():
    return render_template('index.html')

players = {} #key:username #data is player object

@io.event
def connect():
    registerUser(request.sid)

def registerUser(sid):
    # you could replace the first sid here with a generate UUID
    playeruuid = str(uuid.uuid4().hex)
    # print(playeruuid)
    io.emit("getUserInfo", json.dumps({'id': playeruuid}), to=sid)

    @io.event
    def register(info):
        response = json.loads(info)
        # TODO: just update player sid rather than instantiating a new player if the player already exists
        # and then use the UUID here as the key which would probably be better
        players[response["displayName"]] = Player(sid, playeruuid)
        print("Players registered")
        print(players)

@io.on('tag')
def handleTag(location_data):
    print("Starting tag handling...")
    print(location_data)
    print("All locations:")
    get_locations()


def tagHitFromLatandCompass(P1Lat, P1Long, P1Compass, P2Lat, P2Long): #assumes the compass increases counterclockwise
    P1aim = radians(P1Compass)
    P1aim -= pi/2
    if P1aim < 0:
        P1aim += 2*pi
    
    P1y = 111111.1 * P1Lat
    P2y = 111111.1 * P2Lat

    P1x = 111111*cos(P1Lat)*P1Long
    P2x = 111111*cos(P2Lat)*P2Long
    return tagHitCheck(P1x, P1y, P1aim, P2x, P2y)

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

# Make player class
#players = []

class Player:
    def __init__(self, sid, uuid):
        self.sid = sid
        self.uuid = uuid
        self.lat = None
        self.long = None
        self.compass = None
    
    def get_location(self):
        # Get location from client side, and set lat and long
        print("Sending prompt for location to confirm tag...")
        io.emit("send_location", to=self.sid)
        @io.on("receive_location") #hopefully this doesn't break with multiple requests at once)
        def locationReceiver(data):
            print("Recieving location...")
            self.lat, self.long = json.loads(data)['lat'], json.loads(data)['long']
            print(self.lat, self.long)


# def verify_tags(lat, long, direction, name): #Todo rewrite the id to use player name
#     # Check for all players whether or not in range of tag
#     list_of_players = []
#     for p in players:
#         if p == name:
#             continue
#         p.get_location()
#         if tagHitFromLatandCompass(lat, long, direction, p.lat, p.long):
#             list_of_players.append(p)
#     return list_of_players

def get_locations():
    print("Starting get_locations")
    print(players)
    for key in players:
        print(type(players[key]))
        players[key].get_location()

def tag_player(id):
    # Tell the player they have been tagged
    pass


if __name__ == '__main__':
    io.run(app)