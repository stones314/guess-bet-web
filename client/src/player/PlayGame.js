import React, {useState, useRef, useEffect} from "react";
import {images, GameState, MIN_INF, WS_SERVER} from "./../helper/Consts";
import StringInput from "../helper/StringInput";
import BetInput from "./BetInput";

function PlayGame(props) {
    const [gameState, setPageState] = useState(GameState.LOADING);
    const [ans, setAns] = useState("");
    const [bet, setBet] = useState([{opt : -1, val : 0}, {opt : -1, val : 0}]);
    const [betOptions, setBetOptions] = useState([]);
    const [cash, setCash] = useState(2);
    const [won, setWon] = useState(0);
    const [dataSent, setDataSent] = useState(false);
    const [betSizeId, setbetSizeId] = useState(0);
    const [color, setColor] = useState("white");
    const [question, setQuestion] = useState({});
    const [rank, setRank] = useState(0);
    const ws = useRef(null);

    //Web Socket Connect and handling of data from the server.
    //This is only run once at mount
    useEffect(() => {
        ws.current = new WebSocket(WS_SERVER);

        const apiCall = {
            type: "join-game",
            gid: props.gid,
            name: props.name,
        };
        
        ws.current.onopen = (event) => {
            ws.current.send(JSON.stringify(apiCall));
        };
    
        ws.current.onmessage = function (event) {
            const data = JSON.parse(event.data);
            try {
                handleData(data);
            } catch (err) {
                console.log(err);
            }
        };
    
        const handleData = function(data) {
            if(data.type === "state-update"){
                onStateUpdate(data);
            }
            else if(data.type === "connect"){
                onConnect(data);
            }
            else if(data.type === "host-died"){
                if(data.state < GameState.GAME_OVER) props.onGameAbort();
            }
        }

        function onStateUpdate(data){
            if(data.state === GameState.WAIT_FOR_PLAYERS){
                onGameStarted(data);
            }
            else if(data.state === GameState.WAIT_FOR_ANSWERS){
                onRequestAns(data);
            }
            else if(data.state === GameState.WAIT_FOR_BETS){
                onRequestBets(data);
            }
            else if(data.state === GameState.SHOW_BETS){
                onStepGame(data);
            }
            else if(data.state === GameState.SHOW_CORRECT){
                onWinnings(data);
            }
            else if(data.state === GameState.SHOW_STANDINGS){
                onStepGame(data);
            }
            else if(data.state === GameState.GAME_OVER){
                onStepGame(data);
            }
        }
        
        function onGameStarted(data) {
            setColor(data.player.color);
            setPageState(data.state);
        }

        function onRequestAns(data) {
            setDataSent(data.player.ans !== MIN_INF);
            setQuestion(data.question);
            setPageState(data.state);
        }

        function onRequestBets(data) {
            setDataSent(data.player.bet[0].val + data.player.bet[1].val > 0);
            setBetOptions(data.betOpts)
            setPageState(data.state);
        }

        function onWinnings(data) {
            setWon(data.player.won);
            setCash(data.player.cash);
            setBet([{opt : -1, val : 0}, {opt : -1, val : 0}]);
            setAns("");
            setRank(data.player.rank);
            setPageState(data.state);
        }

        function onStepGame(data){
            setPageState(data.state);
        }

        function onConnect(data){
            setColor(data.player.color);
            setCash(data.player.cash);
            onStateUpdate(data);
        }

        const wsCurrent = ws.current;

        // Close socket on unmount:
        return () => wsCurrent.close();
    }, []);

    function onAnsChange(newVal){
        setAns(newVal);
    }

    function onAnsConfirm(){
        if(!ws.current) return;
        
            ws.current.send(JSON.stringify({
                type : "send-ans",
                ans : Number.parseFloat(ans)
            }));
            setDataSent(true);
    }

    function onClickBetSize(index){
        setbetSizeId(index);
    }

    function onClickBet(opt, val){
        var newBet = bet;
        if(bet[0].opt === opt){
            newBet[0].val += val;
            newBet[0].opt = opt;
            if(newBet[0].val === 0) newBet[0].opt = -1;
        }
        else if(bet[1].opt === opt){
            newBet[1].val += val;
            newBet[1].opt = opt;
            if(newBet[1].val === 0) newBet[1].opt = -1;
        }
        else if(bet[0].val === 0){
            newBet[0].val += val;
            newBet[0].opt = opt;
        }
        else if(bet[1].val === 0){
            newBet[1].val += val;
            newBet[1].opt = opt;
        }
        setCash(cash - val);
        setBet(newBet);
    }

    function onBetConfirm(){
        if(!ws.current) return;
        ws.current.send(JSON.stringify({
            type : "send-bet",
            bet : bet
        }));
        setDataSent(true);
    }

    //**********************/
    //Rendering functions:
    /***********************/

    function renderWaitForProgress(text){
        //TODO: animert vente-grafikk!
        return (
            <div className="col m6">
            <div className={"m6"}>
                {text}
            </div>
            <div className={"m6"}>
                <img
                    className="load-img"
                    src={images["coin"+color]}
                    alt={"coin"+color}
                />
                <img
                    className="load-img"
                    src={images["coin"+color]}
                    alt={"coin"+color}
                />
                <img
                    className="load-img"
                    src={images["coin"+color]}
                    alt={"coin"+color}
                />
            </div>
            </div>
        )
    }

    function renderWaitForAnswer(){
        if(dataSent) return (renderWaitForProgress("Venter på at andre svarer..."));
        return (
            <div className="narrow">
                <div className="m3">{question.text}</div>
                <StringInput
                    type="number"
                    description={"Svar i "+question.unit+":"}
                    editVal={ans.toString()}
                    errorMsg={""}
                    onChange={(newValue) => onAnsChange(newValue)}
                    onEnterDown={(e) => {e.preventDefault(); onAnsConfirm()}}
                />
                <img
                    className="q-btn-img"
                    src={images["play"]}
                    alt={"confirm"}
                    onClick={onAnsConfirm}
                />
            </div>
        )
    }

    function renderWaitForBets(){
        if(dataSent) return (renderWaitForProgress("Venter på at andre satser..."));
        return (
            <div className="narrow">
                <BetInput
                    opts={betOptions}
                    bet={bet}
                    cash={cash}
                    color={color}
                    onClickBet={(opt, val) => onClickBet(opt, val)}
                    onBetConfirm={() => onBetConfirm()}
                    onClickBetSize={(index) => onClickBetSize(index)}
                    betSizeId={betSizeId}
                />
            </div>
        )
    }

    function renderCash(){
        var fade = "", fade2 = "";
        const usedCash = bet[0].val + bet[1].val;
        var freeCoins = 0, wonCoins = cash  + usedCash - 2;
        if(usedCash <= 2) {
            freeCoins = 2 - usedCash;
        }
        else {
            wonCoins = cash;
        }
        if(freeCoins <= 0) {
            fade = " fade";
        }
        if(wonCoins <= 0) {
            fade2 = " fade";
        }
        return (
            <div className={"f1 row"}>
                <div className="f1 col center">
                    <div className="">
                        Gjenbruk:
                    </div>
                    <div className={"txt-img-box" + fade}>
                        <img
                            className={"txt-img-img"}
                            src={images["coin"+color]}
                            alt={"coin"+color}
                        />
                        <div className="txt-img-txt-small">{freeCoins}</div>
                    </div>
                </div>
                <div className="f1 col center">
                    <div className="">
                        Vunnet:
                    </div>
                    <div className={"txt-img-box" + fade2}>
                        <img
                            className={"txt-img-img"}
                            src={images["coin"]}
                            alt={"coin"}
                        />
                        <div className="txt-img-txt-small">{wonCoins}</div>
                    </div>
                </div>
            </div>
        );
    }

    function renderGameState(){
        if(gameState === GameState.LOADING)
        {
            return (renderWaitForProgress("Laster... (mulig serveren er nede?)"))
        }
        else if(gameState === GameState.WAIT_FOR_PLAYERS)
        {
            return (renderWaitForProgress("Venter på at quizen skal starte..."))
        }
        else if(gameState === GameState.WAIT_FOR_ANSWERS)
        {
            return (renderWaitForAnswer())
        }
        else if(gameState === GameState.WAIT_FOR_BETS)
        {
            return (renderWaitForBets())
        }
        else if(gameState === GameState.SHOW_BETS)
        {
            return (renderWaitForProgress("Venter på resultatet..."))
        }
        else if(gameState === GameState.SHOW_CORRECT)
        {
            var txt = "Wohoo, du vant " + (won-2) + "!";
            if(won <= 2) txt = "Huff, ingen rette :( ";
            return (
                <div className="narrow col">
                    <div className="m3">
                        {txt}
                    </div>
                </div>
            )
        }
        else if(gameState === GameState.SHOW_STANDINGS)
        {
            return (
                <div className={""}>
                    <div className={"m6"}>
                        {"Du er på " + rank + " plass!"}
                    </div>
                </div>
            )
        }
        else if(gameState === GameState.GAME_OVER)
        {
            return (
                <div className={""}>
                    <div className={"m3"}>
                        {"Quizen er ferdig"}
                    </div>
                    <div className={"m6"}>
                        {"Du kom på " + rank + " plass!"}
                    </div>
                    <img
                        className={"q-btn-img"}
                        src={images["play"]}
                        alt={"play"}
                        onClick={() => props.onClickExit()}
                    />
                </div>
            )
        }
    }
    
    return (
        <div className="narrow col center">
            <div className="narrow row center">
                <div className="f1">{props.name}</div>
                {renderCash()}
            </div>
            {renderGameState()}
        </div>
    )
}

export default PlayGame;