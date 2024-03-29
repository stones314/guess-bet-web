import React, {useState} from "react";
import {images, BetSizes} from "./../helper/Consts";
import BetOption from "./BetOption";
import './../styles/EditQuiz.css';
import {T} from "../helper/Translate";

function BetInput(props) {

    var opts = [];
    for(const [i, opt] of props.opts.entries()){
        var betHere = 0;
        var numBet = 0;
        var totBet = 0;
        props.bet.forEach(bet => {
            if(bet.opt === i && bet.val > 0) betHere = bet.val;
            if(bet.val > 0) {numBet += 1; totBet += bet.val}
        });
        opts.push(
            <BetOption
                key={i}
                lang={props.lang}
                min={opt.min}
                odds={opt.odds}
                bet={betHere}
                totBet={totBet}
                numBet={numBet}
                cash={props.cash}
                betSize={BetSizes[props.betSizeId]}
                opt={i}
                color={props.color}
                onClickBet={(opt, val) => props.onClickBet(opt, val)}
            />
        );
    }

    function renderBetSizes(){
        
        var sizeOpts = [];
        var taken = [];
        const founds = props.cash + props.bet[0].val + props.bet[1].val;
        for (const [i, v] of BetSizes.entries()) {
            var selected = "";
            var val = 1;
            if(i>0)val = Math.ceil(founds * v);
            if(taken.includes(val)){
                if(props.betSizeId === i) props.onClickBetSize(0);
                continue;
            }
            taken.push(val);
            if(i === props.betSizeId) selected = props.color
            sizeOpts.push(
                <div className={"f1 txt-img-box"} key={i} onClick={() => props.onClickBetSize(i)}>
                    <img
                        className={"txt-img-img"}
                        src={images["coin"+selected]}
                        alt={"coin"+selected}
                    />
                    <div className="txt-img-txt-small">{val}</div>
                </div>
            )
        }
        if(sizeOpts.length < 2) return null;
        return (
            <div className="row mid mlr3">
                <div className="mr3">{T("Value +/-", props.lang)}</div>
                <div className="row">{sizeOpts}</div>
            </div>
        )
    }

    var fade = "";
    if(props.bet[0].val + props.bet[1].val < 2) fade = " fade";
    return (
    <div className="narrow">
        <div className="col-reverse">
            {opts}
        </div>
        <div className="row">
            {renderBetSizes()}
            <div className="items-right">
                <img
                    className={"q-btn-img" + fade}
                    src={images["play"]}
                    alt={"confirm"}
                    onClick={() => {if(fade === "") props.onBetConfirm()}}
                />
            </div>
        </div>
    </div>
    )
}

export default BetInput;