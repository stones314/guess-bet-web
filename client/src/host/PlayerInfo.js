import React from "react";
import {images, SERVER, GameState, MIN_INF} from "./../helper/Consts";

const LOADING = -1;
const SHOW_MENU = 0;
const CREATE_QUIZ = 1;
const HOST_GAME = 2;

function PlayerInfo(props) {

    function renderAns(){
        /*
         * show if player has replied at the given game state
         */
        if(props.pInfo.ans === MIN_INF) return (<div className="center f1"></div>)
        else if(props.gameState > GameState.WAIT_FOR_ANSWERS){
            return (<div className="center f1">{props.pInfo.ans}</div>);
        }
        return (<div className="center f1">X</div>);
    }

    function renderBet(){
        /*
         * show how much player bet
         */
        const bet = props.pInfo.bet[0].val + props.pInfo.bet[1].val;
        if(bet <= 0) return (<div className="center f1"></div>)
        return(
            <div className="txt-img-box f1">
                <img
                    className="txt-img-img"
                    src={images["coin"+props.pInfo.color]}
                    alt={"coin"+props.pInfo.color}
                />
                <div className="txt-img-txt">{bet}</div>
            </div>
        );
    }

    function renderCash(dispCash){
        const fade = dispCash === 0 ? " fade" : "";
        return(
            <div className={"txt-img-box"}>
                <img
                    className="txt-img-img"
                    src={images["coin"+props.pInfo.color]}
                    alt={"coin"+props.pInfo.color}
                />
                <div className="txt-img-txt">{dispCash}</div>
            </div>
        );
    }

    if (props.isHdr) {
        return null;
        /*
        return(
            <div className="col brdr txt-left">
                <div className="center f1 brdr txt-left">{props.pInfo.name}</div>
                <div className="center f1 brdr txt-left">{props.pInfo.cash}</div>
                <div className="center f1 brdr txt-left">{props.pInfo.ans}</div>
                <div className="center f1 brdr txt-left">{props.pInfo.bet}</div>
            </div>
        )
        */
    }

    const usedCash = props.pInfo.bet[0].val + props.pInfo.bet[1].val;
    var dispCash = props.pInfo.cash + usedCash - 2;
    const fade = props.pInfo.online ? "" : " fade";
    var thinking = " green";
    if(props.gameState === GameState.WAIT_FOR_ANSWERS) {
        if( props.pInfo.ans === MIN_INF){
            thinking = " red";
        }
    }
    else if(props.gameState === GameState.WAIT_FOR_BETS) {
        if( props.pInfo.bet[0].val + props.pInfo.bet[1].val <= 0 ){
            thinking = " red";
        }
        else {
            dispCash = props.pInfo.cash;
        }
    }
    else if(props.gameState === GameState.SHOW_BETS){
        dispCash = props.pInfo.cash;
    }
    else if(props.gameState === GameState.SHOW_CORRECT){
        dispCash = props.pInfo.cash - 2;
    }
    else if(props.gameState === GameState.SHOW_STANDINGS){
        dispCash = props.pInfo.cash - 2;
        return (
            <div className={"narrow row wrap center" + fade}>
                {renderCash(dispCash)}
                <div className={"pa3 bg-"+props.pInfo.color + " brdr4" + thinking}>
                    {props.pInfo.name}
                </div>
            </div>
        )
    }

    return (
        <div className={"col center" + fade}>
            <div className={"col center pa3 m3 brdr4" + thinking + " bg-"+props.pInfo.color}>
                <div className="f1">{props.pInfo.name}</div>
            </div>
        </div>
    )
}

export default PlayerInfo;