const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const WebSocket = require('ws');

let app = express();

const server = http.createServer(app);

let wss = new WebSocket.Server({ server });

app.engine('html', require('ejs').renderFile);
app.use(express.static('views'))
app.use(express.static('assets'));

const port = 8082;

app.get('/', (req, res) => {
    res.render('CountDownScreen.html')
})

let mqttClient = mqtt.connect("mqtt://localhost:1883");

mqttClient.on('connect', () => {
    mqttClient.subscribe('INICIO_CRUCE_CALLE', (err) => {
    });
    console.log("Clientes Suscritos");
});

// mqttClient.on('message', (topic, message, packet) => {
//     console.log("Mensaje " + topic + " Recibido, data ==> " + message)
//     //ws.send(message);
// })


wss.on('connection', (ws) => {


    mqttClient.on('message', (topic, message, packet) => {
        let parse = JSON.parse(message);
        console.log("Mensaje " + topic + " Recibido, data ==> " + parse)
        ws.send(JSON.stringify(parse));
    })

    ws.on("message", (message) => {
        console.log(`mensaje recibido ${message}`)
    })

});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})