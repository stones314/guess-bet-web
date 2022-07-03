import React from "react";
import {images} from "./../helper/Consts";
import './../styles/EditQuiz.css';


function BetOption(props) {

    function renderBetButton(btnVal){
        if(btnVal < 0 && props.bet === 0) return null;
        if(btnVal > props.cash) return null;
        return (
            <div className="text-img">
                <img
                    className="q-btn-img"
                    src={images["bet" + btnVal]}
                    alt={"bet"}
                    onClick={() => props.onClickBet(props.opt, btnVal)}
                />
            </div>
        )
    }
    
    function renderBet(){
        if(props.bet <= 0) return null;
        return (
            <div className="txt-img-box">
                <img
                    className="txt-img-img"
                    src={images["coin"]}
                    alt={"bet"}
                    onClick={() => props.onClickBet(props.opt, -1)}
                />
                <div className="txt-img-txt">{props.bet}</div>
            </div>
        )
    }

    function renderMin(){
        if(props.min === -12345678) {
            return (
                <div>
                    Lower than all above
                </div>
            )    
        };
        return (
            <div>
                From {props.min}
            </div>
        )
    }

    return (
        <div className="row">
            <div>{"bet = " + props.bet}</div>
            {renderMin()}
            {renderBet()}
            {renderBetButton(1)}
            {renderBetButton(-1)}
        </div>
    )
}

export default BetOption;