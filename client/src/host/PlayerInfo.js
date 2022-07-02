import React from "react";
import CreateQuiz from "./CreateQuiz";
import QuizListElement from "./QuizListElement";
import {images, SERVER} from "./../helper/Consts";
import HostGame from "./HostPlay";
import { useState } from "react";
import { useEffect } from "react";

const LOADING = -1;
const SHOW_MENU = 0;
const CREATE_QUIZ = 1;
const HOST_GAME = 2;

function PlayerInfo(props) {

    function renderPlayerHasRep(rep, gs){
        if(gameState !== gs) return null;
        if(rep === "") return (<div></div>)
        return (<div>X</div>);
    }

    return (
        <div className={"p-info"}>
            <div className={"p-info-name"}>{props.name}</div>
        </div>
    )
}

export default PlayerInfo;