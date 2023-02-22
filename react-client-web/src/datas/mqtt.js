import React from "react";
import mqtt from "mqtt/dist/mqtt";

const MQTT_HOST = 'mqtt://127.0.0.1';
const TOPIC = 'api-platform-iot/socket';

const MQTT_OPTIONS = {
    host: "127.0.0.1",
    port: "1883",
    protocol: "mqtt"
}

/**
 * @param {function} setConnectStatus setter du status de la connexion mqtt
 * @param {function} setClient setter de la réponse mqtt globale
 */
export function mqttConnect(setConnectStatus, setClient){
    setConnectStatus('Connecting');
    setClient(mqtt.connect(MQTT_OPTIONS));
}

/**
 * @param {*} client réponse mqtt globale 
 * @param {function} setConnectStatus setter du status de la connexion mqtt
 * @param {function} setPayload setter du dernier massage reçu de mqtt ? 
 */
export function mqttClientOn(client, setConnectStatus, setPayload){
    if (client) {
        console.log(client);
        client.on('connect', () => {
            setConnectStatus('Connected');

            console.log('[MQTT] Connected')
            client.subscribe(TOPIC, console.log.bind(console, `[MQTT] Subscribed to topic ${TOPIC}`));
        });
        client.on('error', (err) => {
            console.error('Connection error: ', err);
            client.end();
        });
        client.on('reconnect', () => {
            setConnectStatus('Reconnecting');
        });
        client.on('message', (topic, message) => {
            const payload = { topic, message: message.toString() };
            setPayload(payload);

            console.log(`[MQTT] Received message on (${topic}): ${message.toString()}`);
        });
    }
}

export function mqttPublish(client, message) {
    if (client) {
        client.publish(TOPIC, {"msg": message}, error => {
          if (error) {
            console.log('Publish error: ', error);
          }
        });
    }
}