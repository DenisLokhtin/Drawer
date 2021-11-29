const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();
require('express-ws')(app);

const port = 8000;

app.use(cors());

const activeConnections = {};

const coords = [];

app.ws('/draw', function (ws, req) {
    const id = nanoid(10);
    activeConnections[id] = ws;

    console.log(`Client connected! id=${id}`);

    ws.on('message', msg => {
        const message = JSON.parse(msg);

        let data = JSON.stringify({type: 'NEW_MESSAGE', message});
        coords.push(data);

        if (message.type === 'CREATE_MESSAGE') {
            Object.keys(activeConnections).forEach(key => {
                if (key !== id) {
                    const connection = activeConnections[key];
                    connection.send(data);
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