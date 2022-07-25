import React from "react";
import {images, MIN_INF} from "./../helper/Consts";
import './../styles/EditQuiz.css';


function BetOption(props) {

    function renderBetButton(btnVal, btnImg){
        var fade = "";
        if(btnVal <= 0 && props.bet === 0) fade = " fade";
        else if(btnVal > props.cash) fade = " fade";
        else if(props.bet <= 0 && props.numBet === 2) fade = " fade";
        return (
            <div className={"txt-img-box f1" + fade}>
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
    
    //add this to div to enable click on bet to remove it:  onClick={() => props.onClickBet(props.opt, -props.bet)}
    function renderBet(){
        if(props.bet <= 0) return (<div className="f2"></div>);
        return (
            <div className="txt-img-box f2">
                <img
                    className="txt-img-img"
                    src={images["coin"+props.color]}
                    alt={"coin"+props.color}
                />
                <div className="txt-img-txt-small">{props.bet}</div>
            </div>
        )
    }

    function renderMinVal(minVal){
        if(minVal === MIN_INF){
            return(
                <div className="txt-img-txt-3 col">
                    <div>Alt</div>
                    <div>Mindre</div>
                </div>
            );
        }
        return(<div className="txt-img-txt-2">{minVal}</div>);
    }

    function renderMin(){
        return (
            <div className="txt-img-box f2">
                <img
                    className="txt-img-img-2"
                    src={images["riclient"]}
                    alt={"riclient"}
                />
                {renderMinVal(props.min)}
            </div>
        )
    }

    function renderOdds(){
        return (<div className="f1 fs20">{props.odds+"x"}</div>)
    }

    var addVal = 1;
    var minusVal = -1;
    const founds = props.totBet + props.cash;
    if(props.betSize > 0.02) {
        addVal = Math.min(props.cash, Math.ceil(founds * props.betSize));
        minusVal = -Math.min(props.bet, Math.ceil(founds * props.betSize));
    }

    return (
        <div className="row brdr center">
            {renderMin()}
            {renderOdds()}
            {renderBet()}
            {renderBetButton(addVal, "add")}
            {renderBetButton(minusVal, "minus")}
        </div>
    )
}

export default BetOption;