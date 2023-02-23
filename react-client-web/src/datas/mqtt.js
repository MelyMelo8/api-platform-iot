import React from "react";
import mqtt from "mqtt/dist/mqtt";

const TOPIC = 'api-platform-iot/socket';

const MQTT_OPTIONS = {
    host: "127.0.0.1",
    port: "9001",
    protocol: "ws",
    keepalive: 65535 // paramètre pour limiter le nombre de reconnexion sinon à peut près toute les secondes ... C'est le max accepté par Mosquitto ;)
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
export function mqttClientOn(client, setConnectStatus, setLastMessage, setLastMessageTreat){
    if (client) {
        // console.log(client);
        client.on('connect', () => {
            setConnectStatus('Connected');
            console.log('[MQTT] Connected');
            client.subscribe(TOPIC, console.log.bind(console, `[MQTT] Subscribed to topic ${TOPIC}`));
        });
        client.on('error', (err) => {
            console.error('Connection error: ', err);
            client.end();
        });
        client.on('reconnect', () => {
            setConnectStatus('Reconnecting');
            console.log('[MQTT] Reconnecting');
        });
        client.on('message', (topic, message) => {
            setLastMessage(message.toString());
            setLastMessageTreat(false);
            console.log(`[MQTT] Received message on (${topic}): ${message.toString()}`);
        });
    }
}

export function mqttPublish(client, message) {
    if (client) {
        client.publish(TOPIC, message, { QoS: 2 }, error => {
          if (error) {
            console.log('Publish error: ', error);
          } else {
            console.log(`[MQTT] Transmit message on (${TOPIC}): ${message.toString()}`);
          }
        });
    }
}

export function mqttPublishGameStart(client, setGamePlay){
    mqttPublish(client, "game_start");
    setGamePlay(true);
}


export function treatLastMessage(
    treatLastMessage, setLastMessageTreat, lastMessage,
    setCurrentBestTime, setCurrentAverageTime, setCurrentScore, setCurrentTime, setGamePlay
){
    if(!treatLastMessage){
        let msg = lastMessage.split(" ");
        switch(msg[0]){
            case "score_time":
                setCurrentScore(msg[1] ?? 0);
                setCurrentTime(msg[2] ?? 0);
                break;
            case "game_over":
                setGamePlay(false);
                setCurrentBestTime(msg[1] ?? 0);
                setCurrentAverageTime(msg[2] ?? 0);
                break;
            default:
                console.error(`Message ${lastMessage} non traité par nos services`);
                break;
        }
        setLastMessageTreat(true);
    }
}
