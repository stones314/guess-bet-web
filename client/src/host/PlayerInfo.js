import React from "react";
import {images, SERVER, GameState} from "./../helper/Consts";

const LOADING = -1;
const SHOW_MENU = 0;
const CREATE_QUIZ = 1;
const HOST_GAME = 2;

function PlayerInfo(props) {

    function renderPlayerHasRep(rep, gs){
        /*
         * show if player has replied at the given game state
         */
        if(!rep) return (<div className="center f1"></div>)
        return (<div className="center f1">X</div>);
    }

    if (props.isHdr) {
        return(
            <div className="row">
                <div className="center f1">{props.pInfo.name}</div>
                <div className="center f1">{props.pInfo.cash}</div>
                <div className="center f1">{props.pInfo.ans}</div>
                <div className="center f1">{props.pInfo.bet}</div>
            </div>
        )
    }

    return (
        <div className="row">
            <div className="center f1">{props.pInfo.name}</div>
            <div className="center f1">{props.pInfo.cash}</div>
            {renderPlayerHasRep(props.pInfo.ans !== -12345678, GameState.WAIT_FOR_ANSWERS)}
            {renderPlayerHasRep(props.pInfo.bet[0].val + props.pInfo.bet[1].val > 0, GameState.WAIT_FOR_BETS)}
        </div>
    )
}

export default PlayerInfo;