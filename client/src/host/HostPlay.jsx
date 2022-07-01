import React from "react";
import {images, GameState} from "./../helper/Consts";
import { useState, useEffect } from "react";

function HostPlay(props) {
    console.log("Host Play rendered");

    const [gameState, setGameState] = useState(GameState.LOADING);
    const [gid, setGid] = useState(-1);
    const [quiz, setQuiz] = useState(null);
    const [qid, setQid] = useState(-1);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const ws = new WebSocket("ws://16.170.74.73:1337");

        const apiCall = {
            type: "host-game",
            quizId: props.quizIndex,
        };
        
        ws.onopen = (event) => {
            ws.send(JSON.stringify(apiCall));
        };
    
        ws.onmessage = function (event) {
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
                onPlayerJoined(data);
            }
            else if(data.type === "left-game") {
                onPlayerLeft(data);
            }
        }
        
        function onGameStarted(data) {
            setGameState(GameState.WAIT_FOR_PLAYERS);
            setGid(data.gid);
            setQuiz(data.quiz);
        }
        function onPlayerJoined(data) {
            setPlayers(data.data);
            console.log("on join: " + data.data);
        }
        function onPlayerLeft(data) {
            setPlayers(data.data);
        }

        // Close socket on unmount:
        return () => ws.close();
      }, []);


    function onClickContinue() {

    }

    function renderContinue() {
        return (
        <img
            className="hp-img"
            src={images["hp-continue"]}
            alt={"continue"}
            onClick={() => this.onClickContinue()}
        />
        )
    }

    function renderWaitForPlayers() {
        var pList = [];
        for(const [i, p] of players.entries()){
            pList.push(
                <div key={i}>
                    Player {i + " " + p.name + " " + p.cash}
                </div>
            )
        }
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
                    {pList}
                    <br/>
                    WAITING FOR PLAYERS!
                </div>
                <div>
                    {renderContinue()}
                </div>
            </div>
        )
    }

    if(gameState === GameState.LOADING)
    {
        return (
            <div className={"HostMenu"}>
                LOADING
            </div>
        )
    }
    else if(gameState === GameState.WAIT_FOR_PLAYERS)
    {
        return (
            <div className={"HostMenu"}>
                {renderWaitForPlayers()}
            </div>
        )
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

export default HostPlay;