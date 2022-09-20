const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();
require('express-ws')(app);
const ping = require('./ping')

const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/ping', ping);

const activeConnections = {};

let coords = [];

const router = express.Router();

app.ws('/draw', function (ws) {
    const id = nanoid(10);
    activeConnections[id] = ws;

    console.log(`Client connected! id=${id}`);

    ws.on('message', msg => {
        const message = JSON.parse(msg);

        let data = JSON.stringify({type: 'NEW_MESSAGE', message});

        if (message.type === 'CREATE_MESSAGE') {
            coords.push(data);
            Object.keys(activeConnections).forEach(key => {
                if (key !== id) {
                    const connection = activeConnections[key];
                    connection.send(data);
                }
            });
        } else if (message.type === 'CLEAR_MESSAGE') {
            Object.keys(activeConnections).forEach(key => {
                if (key !== id) {
                    const connection = activeConnections[key];
                    coords = [];
                    connection.send(JSON.stringify({
                        type: 'CLEAR_MESSAGE',
                        message: {dataObj: [], type: "NEW_MESSAGE"}
                    }));
                }
            });
        } else {
            console.log('Unknown type', message.type)
        }
    });

    ws.on('close', () => {
        console.log(`Client disconnected! id=${id}`);
        delete activeConnections[id];
    });
    for (let i = 0; i < coords.length; i++) {
        ws.send(coords[i]);
    }
});

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});