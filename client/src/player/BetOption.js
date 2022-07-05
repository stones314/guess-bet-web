import React from "react";
import {images} from "./../helper/Consts";
import './../styles/EditQuiz.css';


function BetOption(props) {

    function renderBetButton(btnVal){
        console.log("o: " + props.opt + "bh: " + props.bet + ", nb: " + props.numBet);
        var fade = "";
        if(btnVal < 0 && props.bet === 0) fade = " fade";
        else if(btnVal > props.cash) fade = " fade";
        else if(props.bet <= 0 && props.numBet === 2) fade = " fade";
        return (
            <div className={"text-img f1" + fade}>
                <img
                    className="q-btn-img"
                    src={images["bet" + btnVal]}
                    alt={"bet"}
                    onClick={() => {
                        if(fade === "") props.onClickBet(props.opt, btnVal)
                    }}
                />
            </div>
        )
    }
    
    function renderBet(){
        if(props.bet <= 0) return (<div className="f2"></div>);
        return (
            <div className="txt-img-box f2">
                <img
                    className="txt-img-img"
                    src={images["coin"+props.color]}
                    alt={"coin"+props.color}
                />
                <div className="txt-img-txt">{props.bet}</div>
            </div>
        )
    }

    function renderMin(){
        if(props.min === -12345678) {
            return (
                <div className="f2">
                    -Inf
                </div>
            )    
        };
        return (
            <div className="f2">
                {props.min}
            </div>
        )
    }

    return (
        <div className="row brdr center">
            {renderMin()}
            {renderBet()}
            {renderBetButton(1)}
            {renderBetButton(-1)}
        </div>
    )
}

export default BetOption;