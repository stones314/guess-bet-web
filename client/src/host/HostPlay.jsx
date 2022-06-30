import React from "react";
import CreateQuiz from "./CreateQuiz";
import QuizListElement from "./QuizListElement";
import {images} from "./../helper/Consts";
import { useState, useEffect } from "react";

const LOADING = -2;
const WAIT_FOR_PLAYERS = -1;
const WAIT_FOR_ANSWERS = 0;
const WAIT_FOR_BETS = 1;
const SHOW_BETS = 2;
const SHOW_CORRECT = 3;
const SHOW_STANDING = 4;
const STATE_COUNT = 5;

function HostPlay(props) {
    console.log("Host Play rendered");

    const [hasWs, setHasWs] = useState(false);
    const [state, setState] = useState({
        pageState: LOADING,
        gid: -1,
        quiz: {},
        questionId: -1,
        players: [],
    });

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
                onPlayerJoined(data);
            }
            else if(data.type === "left-game") {
                onPlayerLeft(data);
            }
        }
        
        function onGameStarted(data) {
            setState({
                pageState : WAIT_FOR_PLAYERS,
                gid : data.gid,
                quiz : data.quiz,
                questionId : state.questionId,
                players : state.players
            });
        }
        function onPlayerJoined(data) {
            var players = state.players;
            players.push(data.name);
            setState({
                pageState : state.pageState,
                gid : state.gid,
                quiz : state.quiz,
                questionId : state.questionId,
                players : players,
            });
        }
        function onPlayerLeft(data) {
            var players = state.players;
            for(const [i, p] of players.entries()){
                if(p.name === data.name) {
                    players.splice(i,1);
                    break;
                }
            }
            setState({
                pageState : WAIT_FOR_PLAYERS,
                gid : data.gid,
                quiz : data.quiz,
                questionId : state.questionId,
                players : players
            });
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
        var players = [];
        for(const [i, p] of state.players){
            players.push(
                <div>
                    Player {i + " " + p.name}
                </div>
            )
        }
        return (
            <div>
                <div>
                    Quiz! <br/>
                    Name: {state.quiz.name} <br/>
                    Lenght: {state.quiz.questions.length} <br/>
                    <br/>
                    Game Id: {state.gid}<br/>
                    <br/>
                    PLAYERS:
                    <br/>
                    {players}
                    <br/>
                    WAITING FOR PLAYERS!
                </div>
                <div>
                    {renderContinue()}
                </div>
            </div>
        )
    }

    if(state.pageState === LOADING)
    {
        return (
            <div className={"HostMenu"}>
                LOADING
            </div>
        )
    }
    else if(state.pageState === WAIT_FOR_PLAYERS)
    {
        return (
            <div className={"HostMenu"}>
                {renderWaitForPlayers()}
            </div>
        )
    }
    else if(state.pageState === WAIT_FOR_ANSWERS)
    {
        return (
            <div className={"HostMenu"}>
                Wait for answers
            </div>
        )
    }
    else if(state.pageState === WAIT_FOR_BETS)
    {
        return (
            <div className={"HostMenu"}>
                Wait for bets
            </div>
        )
    }
}

export default HostPlay;