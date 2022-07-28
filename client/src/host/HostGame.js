import React, {useState, useRef, useEffect} from "react";
import {images, GameState, WS_SERVER} from "../helper/Consts";
import BetBoard from "./BetBoard";
import PlayerInfo from "./PlayerInfo";
import {T} from "../helper/Translate";

function HostGame(props) {
    const [gameState, setGameState] = useState(GameState.LOADING);
    const [gid, setGid] = useState(-1);
    const [quiz, setQuiz] = useState(null);
    const [qid, setQid] = useState(-1);
    const [players, setPlayers] = useState([]);
    const [betOpts, setBetOpts] = useState([]);
    const ws = useRef(null);

    //Connect to server with WS Socket. This runs only once:
    //Handles connect and all messages received from server
    useEffect(() => {
        console.log("Host game, creating host ws-connection:");

        ws.current = new WebSocket(WS_SERVER);
        const apiCall = {
            type: "host-game",
            user: props.user,
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
      }, [props.quizFile]);
    

    function onClickContinue() {
        if(!ws.current) return;

        if(gameState === GameState.LOADING){
            //No action
        }
        else if(gameState >= GameState.WAIT_FOR_PLAYERS && gameState < GameState.GAME_OVER){
            ws.current.send(JSON.stringify({
                type : "step-game",
                state : gameState
            }));
        }
    }

    //**********************/
    //Rendering functions:
    /***********************/

    function renderContinue() {
        var fade = "";
        if(players.length < 2 && gameState < GameState.GAME_OVER){
            fade = " fade";
        }
        return (
        <img
            className={"q-btn-img" + fade}
            src={images["play"]}
            alt={"continue"}
            onClick={() => {
                if(gameState === GameState.GAME_OVER){
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
        const dir = gameState >= GameState.SHOW_STANDINGS ? " col" : " row";
        return(
            <div className={"wide wrap center" + dir}>
                {pList}
            </div>
        )
    }

    function renderGameInfo() {
        if(gameState === GameState.LOADING) return null;
        var qNoInfo = T("Question ",props.lang) + (qid + 1) + T(" of ",props.lang) + quiz.questions.length
        if(gameState === GameState.WAIT_FOR_PLAYERS) qNoInfo = quiz.questions.length + T(" questions",props.lang);
        if(gameState === GameState.GAME_OVER) qNoInfo = T("Finished!",props.lang);
        var gid_split = gid.toString();
        if(gid_split.length === 6){
            gid_split = [gid_split.slice(0,3)," ",gid_split.slice(3)].join("");
        }
        else if(gid_split.length > 6){
            gid_split = [gid_split.slice(0,4)," ",gid_split.slice(4)].join("");
        }
        return (
            <div className="wide row center">
                <div className="f1 mid">
                    <div className="f1"> {quiz.name} </div>
                    <div className="f1"> {qNoInfo} </div>
                </div>
                <div className="f1">
                    <div className="f1"> Quiz ID: </div>
                    <div className="f1 fs26"> {gid_split} </div>
                </div>
                <div className={"col center f1"}>
                    {renderContinue()}
                </div>
            </div>
        )
    }

    function renderGameBoard() {
        return (
            <div className="wide">
                <BetBoard
                    lang={props.lang}
                    pData={players}
                    opts={betOpts}
                    gameState={gameState}
                    question={quiz.questions[qid]}
                />
            </div>
        )
    }

    function renderWaitForPlayers() {
        return (
            <div>
                <div className="m6">
                    {T("Join at: ",props.lang)} <b>rygg-gaard.no/quiz</b>
                </div>
                <div className="m6">
                    {renderPlayerInfo()}
                </div>
            </div>
        )
    }

    function renderQuestion(){
        var unit = T("Answer in ",props.lang) + quiz.questions[qid].unit;
        if(quiz.questions[qid].unit === ""){
            unit = "";
        }
        return(
            <div className="wide m6 brdr">
                <div className="m3">
                    {quiz.questions[qid].text}
                </div>
                <div className="m3">
                    {unit}
                </div>
            </div>
        )
    }

    function renderWaitForAnswers() {
        return (
            <div>
                {renderQuestion()}
                <div className="m6">
                    {renderPlayerInfo()}
                </div>
            </div>
        )
    }

    function renderWaitForBets() {
        return (
            <div>
                {renderQuestion()}
                <div className="m3">
                    {T("Bet at up to two ranges.",props.lang)}
                </div>
                <div className="m6">
                    {renderPlayerInfo()}
                </div>
                <div className="m6">{renderGameBoard()}</div>
            </div>
        )
    }

    function renderShowBets() {
        return (
            <div>
                {renderQuestion()}
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
            return (T("Loading...",props.lang))
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
            return ( renderShowBets() )
        }
        else if(gameState === GameState.SHOW_STANDINGS)
        {
            var header = T("Leaderboard:",props.lang);
            if(qid + 1 === quiz.questions.length) header = T("Final score:",props.lang);
            return (
                <div className="m6">
                    {header}
                    {renderPlayerInfo()}
                </div>)
        }
        else if(gameState === GameState.GAME_OVER)
        {
            return (
                <div className="m6">
                    <h3>{T("Game Over. Thanks for playing!",props.lang)}</h3>
                    {T("Final score:",props.lang)}
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
        </div>
    )
}

export default HostGame;