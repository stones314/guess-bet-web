import React from "react";
import {images, GameState, MIN_INF} from "./../helper/Consts";
import './../styles/EditQuiz.css';
import {T} from "../helper/Translate";


function BetBoardElement(props) {

    function renderAnswer(thisIsCorrect){
        if(!thisIsCorrect) return null;
        if(props.gameState < GameState.SHOW_CORRECT) return null;
        return (
            <div className="mlr3">
                {T("Correct: ",props.lang) + props.question.answer + " " + props.question.unit}
            </div>
        )
    }

    function renderBets(){
        if(props.gameState < GameState.SHOW_BETS) return null;
        if(props.bets.length === 0) return null;

        var coins = [];
        //TODO: use player color on coin somehow
        for(const [i, bet] of props.bets.entries()) {
            var c_txt = bet.val;
            var fade = "";
            if(props.gameState === GameState.SHOW_CORRECT){
                if(props.betData.correct){
                    c_txt = bet.val * props.betData.odds;
                }
                else {
                    c_txt = 0;
                    fade = " fade";
                }
            }
            coins.push(
            <div key={i} className={"txt-img-box"+fade}>
                <img
                    className="txt-img-img pink"
                    src={images["coin"+bet.color]}
                    alt={"coin"+bet.color}
                />
                <div className="txt-img-txt-small">{c_txt}</div>
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
            <div className="mlr3">
                {props.betData.odds + "x"}
            </div>
        )
    }

    function renderMinVal(minVal){
        if(minVal === MIN_INF){
            return(
                <div className="txt-img-txt-3 col">
                    <div>{T("All",props.lang)}</div>
                    <div>{T("lower",props.lang)}</div>
                </div>
            );
        }
        return(<div className="txt-img-txt-2">{minVal}</div>);
    }

    function renderMin(){
        return (
            <div className="txt-img-box-2">
                <img
                    className="txt-img-img-2"
                    src={images["riclient"]}
                    alt={"riclient"}
                />
                {renderMinVal(props.min)}
            </div>
        )
    }

    var bg = "";
    if(props.gameState >= GameState.SHOW_CORRECT && props.betData.correct) bg = " green";
    return (
        <div className={"row wrap brdr" + bg}>
            <div className="row mid items-left">
                {renderMin()}
                {renderOdds()}
                {renderBets()}
                {renderAnswer(bg === " green")}
            </div>
        </div>
    )
}

export default BetBoardElement;