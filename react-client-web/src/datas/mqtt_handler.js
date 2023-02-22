const MQTT = require('mqtt');
const TOPIC = 'api-platform-iot/socket';

const mqtt_handlers = {};

const client = MQTT.connect('mqtt://127.0.0.1');

client.on('connect', function () {

    console.log('[MQTT] Connected')

    client.subscribe(TOPIC, console.log.bind(console, `[MQTT] Subscribed to topic ${TOPIC}`));
});

client.on('message', (topic, payload) => {

    const message = payload.toString();

    console.log(`[MQTT] Received message on (${topic}): ${message}`);

    let args = message.split(" ");

    let fn = mqtt_handlers[args[0]];

    if (typeof fn === "function") fn.apply(null, args.slice(1));
});

exports.publish = (message) => client.publish(TOPIC, message);

// Define handlers here

mqtt_handlers['hello_world'] = function (arg) {
    console.log(`Hello World! (${arg})`);
}
