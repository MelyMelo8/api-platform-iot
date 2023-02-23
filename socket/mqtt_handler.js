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

    args = message.split(" ");

    fn = mqtt_handlers[args[0]];

    if (typeof fn === "function") fn.apply(null, args.slice(1));
});

exports.publish = (message) => client.publish(TOPIC, message, {QoS: 2});

exports.setStartCallback = (callback) => mqtt_handlers['game_start'] = callback;

