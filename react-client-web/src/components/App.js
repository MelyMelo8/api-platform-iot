import React, { useEffect, useState } from "react";
import CurrentGame from "./game/CurrentGame";
import { setOneScore, getAllScores, getOneBoard } from "../datas/api";
import { mqttClientOn, mqttConnect, mqttPublishGameStart, treatLastMessage } from "../datas/mqtt";
import "../style/app.css";
import Board from "./result/Board";

function App(){

    // MQTT 
    const [client, setClient] = useState(null);
    const [connectStatus, setConnectStatus] = useState('offline');
    const [lastMessage, setLastMessage] = useState("");
    const [lastMessageTreat, setLastMessageTreat] = useState(true);

    // Choix des vues
    const [gamePlay, setGamePlay] = useState(false);
    const [gameBoard, setGameBoard] = useState(false);
    const [boardScores, setScores] = useState([]);

    // Au premier chargement de la page : connexion MQTT
    useEffect(() => mqttConnect(setConnectStatus, setClient), []);

    // A chaque changement dans le client (chaque retour de MQTT)
    useEffect(() => {
        mqttClientOn(client, setConnectStatus, setLastMessage, setLastMessageTreat);
    }, [client]);

    useEffect(() => {
        let scores = false ? getOneBoard(currentPseudo) : getAllScores(); // TODO voir pour comment filtrer 
        scores.then((data) => setScores(data));
    }, [gameBoard]);

    // CURRENT GAME 
    const [currentPseudo, setCurrentPseudo] = useState("toto");
    const [currentTime, setCurrentTime] = useState(-1);
    const [currentTimeMin, setCurrentTimeMin] = userState(-1);
    const [currentTimeSomme, setCurrentTimeSomme] = userState(0);
    const [currentScore, setCurrentScore] = useState(0);
    const [isSave, setIsSave] = useState(false);

    // Traitement du dernier message reçu par MQTT 
    treatLastMessage(
        lastMessageTreat, setLastMessageTreat, lastMessage, setCurrentTimeMin, setCurrentTimeSomme,
        currentTimeSomme, currentTimeMin, setCurrentScore, setCurrentTime, setGamePlay
    );

    function rejouer(client, setGamePlay){
        setCurrentTime(-1);
        setCurrentScore(0);
        setCurrentTimeMin(-1);
        setCurrentTimeSomme(0);
        setIsSave(false);
        mqttPublishGameStart(client, setGamePlay);
    }

    function save(){
        setOneScore(currentPseudo, currentScore, currentTimeMin, (currentTimeSomme / currentScore));
        setIsSave(true);
    }

    if(gameBoard){
        return <Board setIsBoard={setGameBoard} scores={boardScores} />
    } else {

        return (
            <>
                <button className="btn_board" onClick={() => setGameBoard(true)}>Voir le tableau des scores</button>
                {gamePlay ? 
                    <CurrentGame pseudo={currentPseudo} best_time={currentBestTime} score={currentScore} time={currentTime} /> 
                : 
                    <center id="hors_partie">
                        {currentScore === 0 ? 
                            <>
                                <div className="group">
                                    <label htmlFor="pseudo">Pseudo : </label>
                                    <input id="pseudo" type="text" value={currentPseudo} onChange={(el) => setCurrentPseudo(el.target.value)} />
                                </div>
                                <button className="btn_start" type="button" onClick={() => mqttPublishGameStart(client, setGamePlay)}>Commencer la partie</button>
                            </>
                        : 
                            <div className="group">
                                <b className="red-text">Partie Terminée</b><br/><br/>
                                Joueur : <b className="blue-text">{currentPseudo}</b><br/><br/>
                                <div className="group text-left">
                                    Score : <b>{currentScore}</b><br/> 
                                    Temps du dernier : {currentTime}ms <br/><br/>
                                    Meilleur Temps : {currentTimeMin}ms <br/>
                                    Temps Moyen : {currentTimeSomme / currentScore}ms 
                                </div>
                                {!isSave ?
                                    <button className="btn_warn" type="button" onClick={() => save()}>Enregistrer ce score en base de données</button>
                                :
                                    <button className="btn_start" type="button" onClick={() => rejouer(client, setGamePlay)}>Rejouer une partie</button>
                                }
                            </div>
                        }
                    </center>
                }
            </>
        );
    }
}

export default App;