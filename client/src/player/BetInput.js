import React from "react";
import {images} from "./../helper/Consts";
import BetOption from "./BetOption";
import './../styles/EditQuiz.css';

function BetInput(props) {

    var opts = [];
    for(const [i, opt] of props.opts.entries()){
        var c = 0;
        props.bet.forEach(bet => {
            if(bet.opt === i && bet.val > 0) c = bet.val;
        });
        opts.push(
            <BetOption
                key={i}
                min={opt.min}
                bet={c}
                cash={props.cash}
                opt={i}
                onClickBet={(opt, val) => props.onClickBet(opt, val)}
            />
        );
    }

    return (
    <div>
        <div className="col-reverse">
            {opts}
        </div>
        <div>
            <img
                className="q-btn-img"
                src={images["q-play"]}
                alt={"confirm"}
                onClick={props.onBetConfirm}
            />
        </div>
    </div>
    )
}

export default BetInput;