import React from "react";
import CreateQuiz from "./CreateQuiz";
import QuizListElement from "./QuizListElement";
import {images, SERVER, GameState} from "./../helper/Consts";
import HostGame from "./HostPlay";
import { useState } from "react";
import { useEffect } from "react";

const LOADING = -1;
const SHOW_MENU = 0;
const CREATE_QUIZ = 1;
const HOST_GAME = 2;

function PlayerInfo(props) {

    function renderPlayerHasRep(rep, gs){
        /*
         * show if player has replied at the given game state
         */
        if(props.gameState !== gs) return null;
        if(!rep) return (<div></div>)
        return (<div>X</div>);
    }

    return (
        <div className={"p-info"}>
            <div className={"p-info-name"}>{props.pInfo.name}</div>
            <div className={"p-info-name"}>{props.pInfo.cash}</div>
            {renderPlayerHasRep(props.pInfo !== "", GameState.WAIT_FOR_ANSWERS)}
            {renderPlayerHasRep(props.pInfo.bets.length > 0, GameState.WAIT_FOR_BETS)}
        </div>
    )
}

export default PlayerInfo;