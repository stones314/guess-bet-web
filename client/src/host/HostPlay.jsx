import React from "react";
import {images, GameState} from "./../helper/Consts";
import { useState, useEffect } from "react";

function HostGame(props) {
    console.log("Host Play rendered");

    const [gameState, setGameState] = useState(GameState.LOADING);
    const [gid, setGid] = useState(-1);
    const [quiz, setQuiz] = useState(null);
    const [qid, setQid] = useState(-1);
    const [players, setPlayers] = useState([]);
    const [click, setClick] = useState(0);
    const ws = useRef(null);

    //Connect to server with WS Socket. This runs only once:
    //Handles connect and all messages received from server
    useEffect(() => {
        ws.current = new WebSocket("ws://16.170.74.73:1337");
        const apiCall = {
            type: "host-game",
            quizId: props.quizIndex,
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
                console.log(data);
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
                console.log("handle join " + data.name);
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
        function onStepGame(data) {
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

    //Rendering functions:

    function renderContinue() {
        return (
        <img
            className="hp-img"
            src={images["q-play"]}
            alt={"continue"}
            onClick={onClickContinue}
        />
        )
    }

    function renderPlayerHasRep(rep, gs){
        if(gameState !== gs) return null;
        if(rep === "") return (<div></div>)
        return (<div>X</div>);
    }

    function renderPlayerInfo(){
        var pList = [];
        for(const [i, p] of players.entries()){
            pList.push(
                <div key={i}>
                    Player {i + " " + p.name + " " + p.cash}
                </div>
            )
        }
        return(
            <div>
                {plist}
            </div>
        )
    }

    function renderWaitForPlayers() {
        return (
            <div>
                <div>
                    Quiz! <br/>
                    Name: {quiz.name} <br/>
                    Lenght: {quiz.questions.length} <br/>
                    <br/>
                    Game Id: {gid}<br/>
                    <br/>
                    PLAYERS:
                    <br/>
                    {renderPlayerInfo()}
                    <br/>
                    WAITING FOR PLAYERS!
                </div>
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
            return (renderWaitForPlayers());
        }
        else if(gameState === GameState.WAIT_FOR_ANSWERS)
        {
            return (
                <div className={"HostMenu"}>
                    Wait for answers
                </div>
            )
        }
        else if(gameState === GameState.WAIT_FOR_BETS)
        {
            return (
                <div className={"HostMenu"}>
                    Wait for bets
                </div>
            )
        }
    }

    return (
        <div className={"hg-box"}>
            <div className={"hg-state"}>
                {renderGameState()}
            </div>
            <div className={"hg-continue"}>
                {renderContinue()}
            </div>
        </div>
    )
}

export default HostGame;