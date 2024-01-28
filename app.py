from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socket = SocketIO(app)

@app.route('/')
def home():
    return render_template('index.html')

@socket.on('tag')
def handleTag(location_data):
    print(location_data)

if __name__ == '__main__':
    socket.run(app)