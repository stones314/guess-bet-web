import React from "react";
import {images, SERVER, GameState} from "./../helper/Consts";

const LOADING = -1;
const SHOW_MENU = 0;
const CREATE_QUIZ = 1;
const HOST_GAME = 2;

function PlayerInfo(props) {

    function renderAns(){
        /*
         * show if player has replied at the given game state
         */
        if(props.pInfo.ans === -12345678) return (<div className="center f1"></div>)
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
            <div className="row">
                <div className="center f1">{props.pInfo.name}</div>
                <div className="center f1">{props.pInfo.cash}</div>
                <div className="center f1">{props.pInfo.ans}</div>
                <div className="center f1">{props.pInfo.bet}</div>
            </div>
        )
    }

    return (
        <div className="row center">
            <div className="center f1">{props.pInfo.name}</div>
            {renderCash()}
            {renderAns()}
            {renderBet()}
        </div>
    )
}

export default PlayerInfo;