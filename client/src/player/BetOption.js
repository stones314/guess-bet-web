import React from "react";
import {images, MIN_INF} from "./../helper/Consts";
import './../styles/EditQuiz.css';


function BetOption(props) {

    function renderBetButton(btnVal){
        var fade = "";
        var btnImg = btnVal < 0 ? "minus" : "add";
        if(btnVal < 0 && props.bet === 0) fade = " fade";
        else if(btnVal > props.cash) fade = " fade";
        else if(props.bet <= 0 && props.numBet === 2) fade = " fade";
        return (
            <div className={"text-img f1" + fade}>
                <img
                    className="q-btn-img"
                    src={images[btnImg]}
                    alt={btnImg}
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
        var minVal = props.min;
        if(props.min === MIN_INF) {
            minVal = "Mindre";
        }
        return (
            <div className="txt-img-box f2">
                <img
                    className="txt-img-img-2"
                    src={images["riclient"]}
                    alt={"riclient"}
                />
                <div className="txt-img-txt-2">{minVal}</div>
            </div>
        )
    }

    function renderOdds(){
        return (<div className="f1 fs20">{props.odds+"x"}</div>)
    }

    var addVal = 1;
    if(props.cash >= 20)addVal = 5;
    var minusVal = -1;
    if(props.bet >= 20)minusVal = -5;
    return (
        <div className="row brdr center">
            {renderMin()}
            {renderOdds()}
            {renderBet()}
            {renderBetButton(addVal)}
            {renderBetButton(minusVal)}
        </div>
    )
}

export default BetOption;