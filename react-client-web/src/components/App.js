import React, { useState } from "react";
import CurrentGame from "./game/CurrentGame";

function App(){

    const [currentPseudo, setCurrentPseudo] = useState("toto");
    const [currentTime, setCurrentTime] = useState(-1);
    const [currentBestTime, setCurrentBestTime] = useState(-1);
    const [currentAverageTime, setCurrentAverageTime] = useState(-1);
    const [currentScore, setCurrentScore] = useState(0);

    return (
        <>
            <CurrentGame pseudo={currentPseudo} best_time={currentBestTime} score={currentScore} time={currentTime} />
        </>
    );
}

export default App;