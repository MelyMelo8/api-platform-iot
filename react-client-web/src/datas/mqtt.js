import React from "react";
import mqtt from "mqtt/dist/mqtt";

const TOPIC = 'api-platform-iot/socket';

const MQTT_OPTIONS = {
    host: "127.0.0.1",
    port: "9001",
    protocol: "ws"
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
        client.publish(TOPIC, message, error => {
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
    setCurrentAverageTime, setCurrentBestTime, setCurrentScore, setCurrentTime, setGamePlay
){
    if(!treatLastMessage){
        let msg = lastMessage.split(" ");
        if (msg.length > 0){
            switch(msg[0]){
                case "score":
                    setCurrentScore(msg[1]);
                    break;
                case "best_time":
                    setCurrentBestTime(msg[1]);
                    break;
                case "average_time":
                    setCurrentAverageTime(msg[1]);
                    break;
                case "time":
                    setCurrentTime(msg[1]);
                    break;
                default:
                    console.error(`Message ${lastMessage} non traité par nos services`);
                    break;
            }
        } else {
            if(lastMessage === "game_over"){
                setGamePlay(false);
            } else {
                console.error(`Message ${lastMessage} non traité par nos services`);
            }
        }
        setLastMessageTreat(true);
    }
}
