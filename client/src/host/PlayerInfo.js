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

    function renderCash(){
        const fade = props.pInfo.cash === 0 ? " fade" : "";
        return(
            <div className={"txt-img-box"+fade}>
                <img
                    className="txt-img-img"
                    src={images["coin"+props.pInfo.color]}
                    alt={"coin"+props.pInfo.color}
                />
                <div className="txt-img-txt">{props.pInfo.cash}</div>
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

    const fade = props.pInfo.online ? "" : " fade";
    var thinking = "";
    if(props.gameState === GameState.WAIT_FOR_ANSWERS) {
        if( props.pInfo.ans === MIN_INF){
            thinking = "d";
        }
    }
    if(props.gameState === GameState.WAIT_FOR_BETS) {
        if( props.pInfo.bet[0].val + props.pInfo.bet[1].val <= 0 ){
            thinking = "d";
        }
    }

    if(props.gameState === GameState.SHOW_STANDINGS){
        return (
            <div className={"narrow row wrap center" + fade}>
                {renderCash()}
                <div className={"pa3 bg-"+props.pInfo.color + " brdr4" + thinking}>
                    {props.pInfo.name}
                </div>
            </div>
        )
    }

    return (
        <div className={"col center" + fade}>
            <div className={"col center pa3 m3 brdr4" + thinking}>
                <div className="f1">{props.pInfo.name}</div>
                <div className="f1">{renderCash()}</div>
            </div>
        </div>
    )
}

export default PlayerInfo;