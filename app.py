import copy
import time
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from math import *
import json
import uuid
import asyncio

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
    def register(registration):
        response = json.loads(registration)
        # TODO: just update player sid rather than instantiating a new player if the player already exists
        # and then use the UUID here as the key which would probably be better
        players[response["displayName"]] = Player(sid, playeruuid, response["displayName"])
        print("Players registered")
        print(players)

@io.on('tag')
def handleTag(location_data):
    print("Starting tag handling...")
    print(location_data)
    #print("All locations:")
    lat, long, name = json.loads(location_data)["lat"] , json.loads(location_data)["long"] , json.loads(location_data)["user"]
    players[name].lat = lat
    players[name].long = long
    findTheTaggedPlayers(lat, long, name)


def tagHitFromLatandCompass(P1Lat, P1Long, P1Compass, P2Lat, P2Long): #assumes the compass increases counterclockwise
    print("Checking for validity of tag")
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
    print("Onto coordinate check")
    #aim should be radians on the unit cicle
    #constants
    positionalLeniancyRadius = 10 #meters should be a bit lower
    #targetingDistance = 75
    #targetingAngleLeniancy = pi/6 #degrees

    if (2*positionalLeniancyRadius)**2 >= (P1x-P2x)**2 + (P1y-P2y)**2 : #checks circle around player
        return True
    # else:
    #     distanceToAimingPoint = positionalLeniancyRadius* 1/sin(targetingAngleLeniancy)
    #     xAimingPoint = P1x - distanceToAimingPoint*cos(P1aim)
    #     yAimingPoint = P1y - distanceToAimingPoint*sin(P1aim)

    #     distanceX = P2x-xAimingPoint
    #     distanceY = P2y-yAimingPoint

    #     if((targetingDistance+2*positionalLeniancyRadius+distanceToAimingPoint)**2 >= distanceX**2 + distanceY**2 and distanceToAimingPoint**2 <= distanceX**2 + distanceY**2):
    #         if distanceX == 0:
    #             if distanceY>0:
    #                 directionToP2 = pi/2
    #             else:
    #                 directionToP2 = 3*pi/2
    #         else:
    #             directionToP2 = atan(distanceY/distanceX)
    #             if distanceX <0:
    #                 directionToP2+=pi 
    #         if directionToP2 < 0:
    #             directionToP2 += 2*pi
    #         deltaAngle = abs(P1aim-directionToP2)
    #         if deltaAngle>180:
    #             deltaAngle = 360 - deltaAngle
    #         if deltaAngle <= targetingAngleLeniancy:
    #             return True

    return False

# Make player class
#players = []

class Player:
    def __init__(self, sid, uuid, display_name):
        self.sid = sid
        self.uuid = uuid
        self.display_name = display_name
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
            return self.lat, self.long


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

def findTheTaggedPlayers(lat, long, tagger_display_name):
    print("Starting get_locations")
    print(players)
    print(tagger_display_name)
    tagger = players[tagger_display_name]
    initial_num_players = len(players)
    player_locations = [] # "player" isn't a great name for "non-tagger players" but i can't come up with anything better

    print("Beginning looping through all targets.")
    for display_name in players:
        print("Current tracked players:" , player_locations)
        if display_name == tagger_display_name:
            print("skipping the tagger" + display_name)
            continue

        player = players[display_name]

        print("Asking for location for target." , {player.display_name} , {player.sid})
        print(type(player.sid))
        io.emit('send_location', to=player.sid)
        @io.on('receive_location')
        def location(data):
            print("Recieved location information")
            data = json.loads(data)
            print(data)
            print(type(data))
            player.lat = data['lat']
            player.long = data['long']
            player_locations.append(copy.copy(player))

    while len(player_locations) < initial_num_players - 1: 
        print(initial_num_players)
        print(player_locations)
        print("sleeping....")
        time.sleep(1)

    for player in player_locations:
        print(tagger.lat)
        print(tagger.long)
        print(type(tagger.lat))
        if tagHitFromLatandCompass(tagger.lat, tagger.long, 0, player.lat, player.long): #todo add compass when it works later
            print("Valid tag, sending tag message to target")
            tag_player(player.display_name, tagger.display_name)
        else:
            print("Invalid tag")

def tag_player(tagged, tagger):
    # Tell the player they have been tagged
    io.emit("youHaveBeenTagged", json.dumps({'tagger': tagger}), to=players[tagged].sid)


if __name__ == '__main__':
    io.run(app)