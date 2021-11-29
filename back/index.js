const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();
require('express-ws')(app);

const port = 8000;

app.use(cors());

const activeConnections = {};

app.ws('/draw', function (ws, req) {
    const id = nanoid(10);
    activeConnections[id] = ws;

    console.log(`Client connected! id=${id}`);

    ws.on('message', msg => {
        const message = JSON.parse(msg);

        if (message.type === 'CREATE_MESSAGE') {
            Object.keys(activeConnections).forEach(key => {
                if (key !== id) {
                    const connection = activeConnections[key];

                    connection.send(JSON.stringify({type: 'NEW_MESSAGE', message}));
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
});


app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});