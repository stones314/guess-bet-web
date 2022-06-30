import React from "react";
import {images, GameState} from "./../helper/Consts";
import { useState } from "react";
import { useEffect } from "react";

function PlayGame(props) {
    console.log("HostMenu rendered");

    const [pageState, setPageState] = useState(GameState.LOADING);
    //const [quizList, setQuizList] = useState([]);
    //const [quizIndex, setQuizIndex] = useState(-1);

    useEffect(() => {
        const ws = new WebSocket("ws://16.170.74.73:1337");

        const apiCall = {
            type: "join-game",
            gid: props.gid,
            name: props.name,
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
            if(data.type === "join-game") {
                onGameStarted(data);
            }
        }
        
        function onGameStarted(data) {
            console.log("Game Started : " + data);
            setPageState(GameState.WAIT_FOR_PLAYERS);
        }

        // Close socket on unmount:
        return () => ws.close();
      }, []);

    if(pageState === GameState.LOADING)
    {
        return (
            <div className={"HostMenu"}>
                LOADING...
            </div>
        )
    }
    else if(pageState === GameState.WAIT_FOR_PLAYERS)
    {
        return (
            <div className={"HostMenu"}>
                Waiting for players to join and for host to start the quiz.
            </div>
        )
    }
    else if(pageState === GameState.WAIT_FOR_ANSWERS)
    {
        return (
            <div className={"HostMenu"}>
                Suggest what might be a correct answer for the quiestion!
            </div>
        )
    }
    else if(pageState === GameState.WAIT_FOR_BETS)
    {
        return (
            <div className={"HostMenu"}>
                Bet on a range!
            </div>
        )
    }
    else if(pageState >= GameState.SHOW_BETS && pageState <= GameState.SHOW_STANDINGS)
    {
        return (
            <div className={"HostMenu"}>
                No user input required here!
            </div>
        )
    }
}

export default PlayGame;