import React from "react";
import {images} from "./../helper/Consts";
import BetOption from "./BetOption";
import './../styles/EditQuiz.css';

function BetInput(props) {

    var opts = [];
    for(const [i, opt] of props.opts.entries()){
        var c = 0;
        props.bets.forEach(bet => {
            if(bet.id === i) c = bet.cash;
        });
        opts.push(
            <BetOption
                key={i}
                min={opt.min}
                bet={c}
                onClickBet={(val) => props.onClickBet(i, val)}
            />
        );
    }

    return (
        <div>
            {opts}
            <img
                className="q-btn-img"
                src={images["q-play"]}
                alt={"confirm"}
                onClick={props.onBetConfirm}
            />
        </div>
    )
}

export default BetInput;