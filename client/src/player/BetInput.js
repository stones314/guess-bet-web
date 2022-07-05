import React from "react";
import {images} from "./../helper/Consts";
import BetOption from "./BetOption";
import './../styles/EditQuiz.css';

function BetInput(props) {

    var opts = [];
    for(const [i, opt] of props.opts.entries()){
        var betHere = 0;
        var numBet = 0;
        props.bet.forEach(bet => {
            if(bet.opt === i && bet.val > 0) betHere = bet.val;
            if(bet.val > 0) numBet += 1;
        });
        opts.push(
            <BetOption
                key={i}
                min={opt.min}
                bet={betHere}
                numBet={numBet}
                cash={props.cash}
                opt={i}
                color={props.color}
                onClickBet={(opt, val) => props.onClickBet(opt, val)}
            />
        );
    }

    var fade = "";
    if(props.bet[0].val + props.bet[1].val < 2) fade = " fade";
    return (
    <div className="narrow">
        <div className="col-reverse">
            {opts}
        </div>
        <div>
            <img
                className={"q-btn-img" + fade}
                src={images["q-play"]}
                alt={"confirm"}
                onClick={() => {if(fade === "") props.onBetConfirm()}}
            />
        </div>
    </div>
    )
}

export default BetInput;