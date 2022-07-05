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
        if(props.pInfo.cash === 0) {
            return(<div className="center f1"></div>);
        }
        return(
            <div className="txt-img-box f1">
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
        return(
            <div className="row center brdr">
                <div className="center f2 brdr">{props.pInfo.name}</div>
                <div className="center f1 brdr">{props.pInfo.cash}</div>
                <div className="center f1 brdr">{props.pInfo.ans}</div>
                <div className="center f1 brdr">{props.pInfo.bet}</div>
            </div>
        )
    }

    const fade = props.pInfo.online ? "" : " fade";

    return (
        <div className={"row center brdr" + fade}>
            <div className="center f2">{props.pInfo.name}</div>
            {renderCash()}
            {renderAns()}
            {renderBet()}
        </div>
    )
}

export default PlayerInfo;