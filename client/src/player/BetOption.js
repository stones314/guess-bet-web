import React from "react";
import {images} from "./../helper/Consts";
import './../styles/EditQuiz.css';


function BetOption(props) {

    function renderBetButton(btnVal){
        if(btnVal < 0 && props.bet === 0) return null;
        if(btnVal > props.cash) return null;
        return (
            <div>
                <img
                    className="q-btn-img"
                    src={images["bet" + btnVal]}
                    alt={"bet"}
                    onClick={props.onBetClick(btnVal)}
                />
            </div>
        )
    }
    
    function renderBet(){
        return (
            <div>
                <img
                    className="q-btn-img"
                    src={images["coin"]}
                    alt={"bet"}
                    onClick={props.onBetClick(-1)}
                />
                <div className="centred">{props.bet}</div>
            </div>
        )
    }

    function renderMin(){
        if(props.min === -12345678) return null;
        return (
            <div>
                Min: {props.min}
            </div>
        )
    }

    return (
        <div>
            {renderMin()}
            {renderBet()}
            {renderBetButton(1, props.cash, props.bet)}
            {renderBetButton(-1, props.cash, props.bet)}
        </div>
    )
}

export default BetOption;