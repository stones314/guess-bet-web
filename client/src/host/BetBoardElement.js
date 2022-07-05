import React from "react";
import {images, GameState} from "./../helper/Consts";
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
            <div>
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
        var val = props.min;
        if(props.min === -12345678) {
            val = "Mindre"    
        };
        return (
            <div className="row w100 m1">
                <div className="yellow f1 txt-left">
                    {val}
                </div>
                    <img
                        className="f3 rihost-img"
                        src={images["rihost"]}
                        alt={"cihost"}
                    />
            </div>
        )
    }

    var bg = " green";
    if(props.gameState >= GameState.SHOW_CORRECT && props.betData.correct) bg = " gold";
    return (
        <div className={"col center f1 brdr" + bg}>
            {renderMin()}
            {renderOdds()}
            {renderBets()}
        </div>
    )
}

export default BetBoardElement;