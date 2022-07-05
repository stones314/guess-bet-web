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
                {"1 : " + props.betData.odds}
            </div>
        )
    }

    function renderMin(){
        if(props.min === -12345678) {
            return (
                <div>
                    -Inf
                </div>
            )    
        };
        return (
            <div>
                {props.min}
            </div>
        )
    }

    var bg = " green";
    if(props.gameState >= GameState.SHOW_CORRECT && props.betData.correct) bg = " gold";
    return (
        <div className={"col-reverse center f1 brdr" + bg}>
            {renderMin()}
            {renderOdds()}
            {renderBets()}
        </div>
    )
}

export default BetBoardElement;