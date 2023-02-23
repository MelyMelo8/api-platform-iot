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
    treatLastMessage, setLastMessageTreat, lastMessage, setCurrentTimeMin, setCurrentTimeSomme,
    currentTimeSomme, currentTimeMin, setCurrentScore, setCurrentTime, setGamePlay
){
    if(!treatLastMessage){
        if(lastMessage === "game_over"){
            setGamePlay(false);
        } else {
            let msg = lastMessage.split(" ");
            switch(msg[0]){
                case "score":
                    setCurrentScore(msg[1] ?? 0);
                    break;
                case "time":
                    let time = msg[1] ?? 0;
                    setCurrentTime(time);
                    setCurrentTimeMin(time < currentTimeMin ? time : currentTimeMin);
                    setCurrentTimeSomme(currentTimeSomme + time);
                    break;
                default:
                    console.error(`Message ${lastMessage} non traité par nos services`);
                    break;
            }
        }
        setLastMessageTreat(true);
    }
}
