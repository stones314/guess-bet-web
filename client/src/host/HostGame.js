import React, {useState, useRef, useEffect} from "react";
import {images, GameState} from "../helper/Consts";
import BetBoard from "./BetBoard";
import PlayerInfo from "./PlayerInfo";

function HostGame(props) {
    const [gameState, setGameState] = useState(GameState.LOADING);
    const [gid, setGid] = useState(-1);
    const [quiz, setQuiz] = useState(null);
    const [qid, setQid] = useState(-1);
    const [players, setPlayers] = useState([]);
    const [click, setClick] = useState(0);
    const [betOpts, setBetOpts] = useState([]);
    const ws = useRef(null);

    //Connect to server with WS Socket. This runs only once:
    //Handles connect and all messages received from server
    useEffect(() => {
        ws.current = new WebSocket("ws://16.170.74.73:1337");
        const apiCall = {
            type: "host-game",
            file: props.quizFile,
        };
        ws.current.onopen = (event) => {
            ws.current.send(JSON.stringify(apiCall));
        };
        ws.current.onclose = (event) => {
            console.log("ws closed");
        };

        ws.current.onmessage = function (event) {
            const data = JSON.parse(event.data);
            try {
                handleData(data);
            } catch (err) {
                console.log(err);
            }
        };
    
        const handleData = function(data) {
            if(data.type === "host-game") {
                onGameStarted(data);
            }
            else if(data.type === "join-game") {
                onPlayerUpdate(data);
            }
            else if(data.type === "left-game") {
                onPlayerUpdate(data);
            }
            else if(data.type === "step-game") {
                onStepGame(data);
            }
            else if(data.type === "player-ans") {
                onPlayerUpdate(data);
            }
            else if(data.type === "player-bet") {
                onPlayerUpdate(data);
            }
            else if(data.type === "bet-opts") {
                onBetOpts(data);
            }
        }
        
        function onGameStarted(data) {
            setGameState(GameState.WAIT_FOR_PLAYERS);
            setGid(data.gid);
            setQuiz(data.quiz);
            setQid(0);
        }
        function onPlayerUpdate(data) {
            setPlayers(data.data);
        }
        function onBetOpts(data) {
            setBetOpts(data.betOpts);
        }
        function onStepGame(data) {
            setQid(data.qid);
            setGameState(data.newState);
            setPlayers(data.data);
        }

        const wsCurrent = ws.current;

        // Close socket on unmount:
        return () => wsCurrent.close();
      }, []);
    
      //Messages to server. This runs when user clicks a button
      useEffect(() => {
        if(!ws.current) return;

        if(gameState === GameState.LOADING){
            //No action
        }
        else if(gameState >= GameState.WAIT_FOR_PLAYERS && gameState <= GameState.SHOW_STANDINGS){
            ws.current.send(JSON.stringify({
                type : "step-game",
                state : gameState
            }));
        }
      }, [click]);


    function onClickContinue() {
        setClick(click + 1);
    }

    //**********************/
    //Rendering functions:
    /***********************/

    function renderContinue() {
        var fade = "";
        if(players.length < 2 && gameState < GameState.SHOW_STANDINGS){
            fade = " fade";
        }
        return (
        <img
            className={"q-btn-img" + fade}
            src={images["play"]}
            alt={"continue"}
            onClick={() => {
                if(gameState === GameState.SHOW_STANDINGS){
                    props.onClickExit();
                }
                if(fade === ""){
                    onClickContinue()
                }
            }}
        />
        )
    }

    function renderPlayerInfo(){
        var pList = [];
        var hdr = {
            name : "Navn",
            cash : "Penger",
            ans : "Svar",
            bet : "Innsats"
        }
        pList.push(
            <PlayerInfo
                key={-1}
                pInfo={hdr}
                gameState={gameState}
                isHdr={true} 
            />
        );
        for(const [i, p] of players.entries()){
            pList.push(
                <PlayerInfo
                    key={i}
                    pInfo={p}
                    gameState={gameState}
                    isHdr={false}
                />
            );
        }
        const dir = gameState === GameState.SHOW_STANDINGS ? " col" : " row";
        return(
            <div className={"wide wrap center" + dir}>
                {pList}
            </div>
        )
    }

    function renderGameInfo() {
        if(gameState === GameState.LOADING) return null;
        var qNoInfo = "Spørsmål " + (qid + 1) + " av " + quiz.questions.length
        if(gameState === GameState.WAIT_FOR_PLAYERS) qNoInfo = quiz.questions.length + " spørsmål";
        return (
            <div className="wide row center">
                <div className="f1"> {quiz.name} </div>
                <div className="f1 fs26"> {gid} </div>
                <div className="f1"> {qNoInfo} </div>
            </div>
        )
    }

    function renderGameBoard() {
        return (
            <div className="wide">
                <BetBoard
                    pData={players}
                    opts={betOpts}
                    gameState={gameState}
                />
            </div>
        )
    }

    function renderWaitForPlayers() {
        return (
            <div>
                <div className="m6">
                    Venter på at deltagere logger på med ID-en over...
                </div>
                <div className="m6">
                    {renderPlayerInfo()}
                </div>
            </div>
        )
    }

    function renderWaitForAnswers() {
        return (
            <div>
                <div className="wide m6 brdr">
                    <div className="m3">
                        {quiz.questions[qid].text}
                    </div>
                    <div className="m3">
                        Svar i {quiz.questions[qid].unit}
                    </div>
                </div>
                <div className="m6">
                    {renderPlayerInfo()}
                </div>
            </div>
        )
    }

    function renderWaitForBets() {
        return (
            <div>
                <div className="wide m6 brdr">
                    <div className="m3">
                        {quiz.questions[qid].text}
                    </div>
                    <div className="m3">
                        Svar i {quiz.questions[qid].unit}
                    </div>
                </div>
                <div className="m6">
                    {renderPlayerInfo()}
                </div>
                <div className="m6">{renderGameBoard()}</div>
            </div>
        )
    }

    function renderShowBets(showCorrect = false) {
        var ansTxt = "Svar i " + quiz.questions[qid].unit;
        if(showCorrect) ansTxt = "Riktig svar er " + quiz.questions[qid].answer + " " + quiz.questions[qid].unit;
        return (
            <div>
                <div className="wide m6 brdr">
                    <div className="m3">
                        {quiz.questions[qid].text}
                    </div>
                    <div className="m3">
                        {ansTxt}
                    </div>
                </div>
                <div className="m6">
                    {renderPlayerInfo()}
                </div>
                <div className="m6">{renderGameBoard()}</div>
            </div>
        )
    }

    function renderGameState(){
        if(gameState === GameState.LOADING)
        {
            return ("LOADING")
        }
        else if(gameState === GameState.WAIT_FOR_PLAYERS)
        {
            return (renderWaitForPlayers())
        }
        else if(gameState === GameState.WAIT_FOR_ANSWERS)
        {
            return (renderWaitForAnswers())
        }
        else if(gameState === GameState.WAIT_FOR_BETS)
        {
            return ( renderWaitForBets() )
        }
        else if(gameState === GameState.SHOW_BETS)
        {
            return ( renderShowBets() )
        }
        else if(gameState === GameState.SHOW_CORRECT)
        {
            return ( renderShowBets(true) )
        }
        else if(gameState === GameState.SHOW_STANDINGS)
        {
            return (
                <div>
                    Resultatliste:
                    {renderPlayerInfo()}
                </div>)
        }
    }

    return (
        <div className={"col center"}>
            <div className={"col"}>
                {renderGameInfo()}
            </div>
            <div className={"col"}>
                {renderGameState()}
            </div>
            <div className={"col center"}>
                {renderContinue()}
            </div>
        </div>
    )
}

export default HostGame;