import React from "react";
import { getAllScores, getOneBoard } from "../../datas/api";
import "../../style/board.css"

function Board({setIsBoard, pseudo = "", scores}){    
    return (
        <>
            <h2>Tableau des scores {pseudo !== "" && <>de {pseudo}</>}</h2>
            <table id="scoreboard" style={{margin:15}}>
                <thead>
                    <tr>
                        {pseudo === "" && <th>Pseudo</th>}
                        <th>Score</th>
                        <th>Meilleur temps</th>
                        <th>Temps moyen</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((score, i) => {
                        return (
                            <tr key={"tr-" + score.pseudo + "-" + score.score + "-" + i}>
                                {pseudo === "" && <td>{score.pseudo}</td>}
                                <td>{score.score}</td>
                                <td>{score.best_time}ms</td>
                                <td>{score.average_time}ms</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <button className="button btn_return" onClick={() => setIsBoard(false)}>Retour à la page principale</button>
        </>
    );
}

export default Board;