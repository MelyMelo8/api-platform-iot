import React from "react";
import "../../style/game.css";

function CurrentGame({pseudo, score, best_time, time}){
    return (
        // TODO : CSS
        // TODO : faire pour si score = 0, afficher bouton commencer la partie (voir coté App)
        <center>
            <h1>Partie en cours : <b>{pseudo}</b> {best_time !== -1 && <>(meilleur temps : {best_time}ms)</>}</h1>
            <>Bouton n°{score}, temps : {time}ms</>
        </center>
    );
}

export default CurrentGame;