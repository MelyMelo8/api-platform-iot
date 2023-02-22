import React, { useEffect, useState } from "react";
import CurrentGame from "./game/CurrentGame";
import { mqttClientOn, mqttConnect, mqttPublish, mqttPublishGameStart, treatLastMessage } from "../datas/mqtt";
import "../style/app.css";

function App(){

    // MQTT 
    const [client, setClient] = useState(null);
    const [connectStatus, setConnectStatus] = useState('offline');
    const [lastMessage, setLastMessage] = useState("");
    const [lastMessageTreat, setLastMessageTreat] = useState(true);
    const [gamePlay, setGamePlay] = useState(false);

    // Au premier chargement de la page : connexion MQTT
    useEffect(() => mqttConnect(setConnectStatus, setClient), []);

    // A chaque changement dans le client (chaque retour de MQTT)
    useEffect(() => {
        mqttClientOn(client, setConnectStatus, setLastMessage, setLastMessageTreat);
    }, [client]);

    // CURRENT GAME 
    const [currentPseudo, setCurrentPseudo] = useState("toto");
    const [currentTime, setCurrentTime] = useState(-1);
    const [currentBestTime, setCurrentBestTime] = useState(-1);
    const [currentAverageTime, setCurrentAverageTime] = useState(-1);
    const [currentScore, setCurrentScore] = useState(0);

    // Traitement du dernier message reçu par MQTT 
    treatLastMessage(
        lastMessageTreat, setLastMessageTreat, lastMessage,
        setCurrentAverageTime, setCurrentBestTime, setCurrentScore, setCurrentTime, setGamePlay
    );

    return (
        <>
            {gamePlay ? 
                <CurrentGame pseudo={currentPseudo} best_time={currentBestTime} score={currentScore} time={currentTime} /> 
            : 
                <center id="hors_partie">
                    <div className="group">
                        <label htmlFor="pseudo">Pseudo : </label>
                        <input id="pseudo" type="text" value={currentPseudo} onChange={(el) => setCurrentPseudo(el.target.value)} />
                    </div>
                    <button id="btn_start" type="button" onClick={() => mqttPublishGameStart(client, setGamePlay)}>Commencer la partie</button>
                </center>
            }
        </>
    );
}

export default App;