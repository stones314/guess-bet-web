import React from "react";
import {images} from "./../helper/Consts";
import BetBoardElement from "./BetBoardElement";
import './../styles/EditQuiz.css';

function BetBoard(props) {

    var elements = [];
    for(const [i, opt] of props.opts.entries()){
        var bets = [];
        props.pData.forEach(pd => {
            pd.bet.forEach(bet => {
                if(bet.opt === i && bet.val > 0)bets.push({
                    player : pd.name,
                    val : bet.val,
                    color : pd.color,
                    won : pd.won
                });
            })
        });
        elements.push(
            <BetBoardElement
                key={i}
                min={opt.min}
                bets={bets}
                betData={props.opts[i]}
                gameState={props.gameState}
            />
        );
    }

    return (
    <div className="col-reverse">
        {elements}
    </div>
    )
}

export default BetBoard;