import React from "react";
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
                lang={props.lang}
                min={opt.min}
                bets={bets}
                betData={props.opts[i]}
                gameState={props.gameState}
                question={props.question}
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