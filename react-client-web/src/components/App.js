import React, { useEffect, useState } from "react";
import CurrentGame from "./game/CurrentGame";
import { mqttClientOn, mqttConnect, mqttPublish, mqttPublishGameStart } from "../datas/mqtt";

function App(){

    // MQTT 
    const [client, setClient] = useState(null);
    const [connectStatus, setConnectStatus] = useState('offline');
    const [lastMessage, setLastMessage] = useState("");
    const [lastMessageTreat, setLastMessageTreat] = useState(true);
    const [gamePlay, setGamePlay] = useState(false);

    // Au premier chargement de la page : connexion MQTT
    useEffect(() => mqttConnect(setConnectStatus, setClient), []);

    // A chaque changement de client (chaque retour de MQTT)
    useEffect(() => {
        mqttClientOn(client, setConnectStatus, setLastMessage, setLastMessageTreat);
    }, [client]);

    // CURRENT GAME 
    const [currentPseudo, setCurrentPseudo] = useState("toto");
    const [currentTime, setCurrentTime] = useState(-1);
    const [currentBestTime, setCurrentBestTime] = useState(-1);
    const [currentAverageTime, setCurrentAverageTime] = useState(-1);
    const [currentScore, setCurrentScore] = useState(0);

    return (
        <>
            {gamePlay ? 
                <CurrentGame pseudo={currentPseudo} best_time={currentBestTime} score={currentScore} time={currentTime} /> 
            : 
                <center>
                    <button type="button" onClick={() => mqttPublishGameStart(client, setGamePlay)}>Commencer la partie</button>
                </center>
            }
        </>
    );
}

export default App;