import React from "react";
import {images, GameState, MIN_INF} from "./../helper/Consts";
import './../styles/EditQuiz.css';


function BetBoardElement(props) {

    function renderBets(){
        if(props.gameState < GameState.SHOW_BETS) return null;
        if(props.bets.length === 0) return null;

        var coins = [];
        //TODO: use player color on coin somehow
        for(const [i, bet] of props.bets.entries()) {
            coins.push(
            <div key={i} className="txt-img-box">
                <img
                    className="txt-img-img pink"
                    src={images["coin"+bet.color]}
                    alt={"coin"+bet.color}
                />
                <div className="txt-img-txt">{bet.val}</div>
            </div>
            );
        }

        return (
            <div className="row">
                {coins}
            </div>
        )
    }

    function renderOdds(){
        return (
            <div>
                {props.betData.odds + "x"}
            </div>
        )
    }

    function renderMin(){
        var minVal = props.min;
        if(props.min === MIN_INF) {
            minVal = "";
        }
        return (
            <div className="txt-img-box-2">
                <img
                    className="txt-img-img-2"
                    src={images["riclient"]}
                    alt={"riclient"}
                />
                <div className="txt-img-txt-2">{minVal}</div>
            </div>
        )
    }

    var bg = "";
    if(props.gameState >= GameState.SHOW_CORRECT && props.betData.correct) bg = " green";
    return (
        <div className={"row wrap brdr" + bg}>
            <div className="row mid items-left">{renderMin()}{renderOdds()}{renderBets()}</div>
        </div>
    )
}

export default BetBoardElement;