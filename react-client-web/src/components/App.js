import React, { useEffect, useState } from "react";
import CurrentGame from "./game/CurrentGame";
import { mqttClientOn, mqttConnect, mqttPublish } from "../datas/mqtt";

function App(){

    // MQTT 
    const [client, setClient] = useState(null);
    const [connectStatus, setConnectStatus] = useState('offline');
    const [payload, setPayload] = useState({});

    // Au premier chargement de la page : connexion MQTT
    useEffect(() => mqttConnect(setConnectStatus, setClient), []);

    // A chaque changement de client (chaque retour de MQTT)
    useEffect(() => {
        mqttClientOn(client, setConnectStatus, setPayload);
    }, [client]);
      
    console.log(client);

    // CURRENT GAME 
    const [currentPseudo, setCurrentPseudo] = useState("toto");
    const [currentTime, setCurrentTime] = useState(-1);
    const [currentBestTime, setCurrentBestTime] = useState(-1);
    const [currentAverageTime, setCurrentAverageTime] = useState(-1);
    const [currentScore, setCurrentScore] = useState(0);

    if(client){
        mqttPublish(client, "TEST"); // la connexion passe en ws (websocket) et du coup bah ça marche pas ... 
    }

    return (
        <>
            <CurrentGame pseudo={currentPseudo} best_time={currentBestTime} score={currentScore} time={currentTime} />
        </>
    );
}

export default App;