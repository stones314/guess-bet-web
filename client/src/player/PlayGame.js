import React, {useState, useRef, useEffect} from "react";
import {images, GameState} from "./../helper/Consts";
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
    const [click, setClick] = useState(0);
    const [color, setColor] = useState("white");
    const ws = useRef(null);

    //Web Socket Connect and handling of data from the server.
    //This is only run once at mount
    useEffect(() => {
        ws.current = new WebSocket("ws://16.170.74.73:1337");

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
                console.log(data);
                handleData(data);
            } catch (err) {
                console.log(err);
            }
        };
    
        const handleData = function(data) {
            if(data.type === "join-game") {
                onGameStarted(data);
            }
            else if(data.type === "req-ans") {
                onRequestAns(data);
            }
            else if(data.type === "req-bets") {
                onRequestBets(data);
            }
            else if(data.type === "winnings") {
                onWinnings(data);
            }
            else if(data.type === "step-game") {
                onStepGame(data);
            }
            else if(data.type === "end-game") {
                props.onGameAbort();
            }
        }
        
        function onGameStarted(data) {
            console.log("Game Started : " + data);
            setColor(data.color);
            setPageState(GameState.WAIT_FOR_PLAYERS);
        }

        function onRequestAns(data) {
            setDataSent(false);
            setPageState(GameState.WAIT_FOR_ANSWERS);
        }

        function onRequestBets(data) {
            setDataSent(false);
            setBetOptions(data.betOpts)
            setPageState(GameState.WAIT_FOR_BETS);
        }

        function onWinnings(data) {
            console.log(data);
            setWon(data.won);
            setCash(data.cash);
            setBet([{opt : -1, val : 0}, {opt : -1, val : 0}]);
            setAns("");
            setPageState(GameState.SHOW_STANDINGS);
        }

        function onStepGame(data){
            setPageState(data.newState);
        }

        const wsCurrent = ws.current;

        // Close socket on unmount:
        return () => wsCurrent.close();
    }, []);

    //Messages to server. This runs when user clicks a button
    useEffect(() => {
       if(!ws.current) return;
        
        if(gameState === GameState.LOADING){
            //No action
        }
        else if(gameState === GameState.WAIT_FOR_ANSWERS){
            ws.current.send(JSON.stringify({
                type : "send-ans",
                ans : Number.parseFloat(ans)
            }));
        }
        else if(gameState === GameState.WAIT_FOR_BETS){
            ws.current.send(JSON.stringify({
                type : "send-bet",
                bet : bet
            }));
        }
    }, [click]);

    function onAnsChange(newVal){
        setAns(newVal);
    }

    function onAnsConfirm(){
        setDataSent(true);
        setClick(click +1);
    }

    function onBetClick(opt, val){
        var newBet = bet;
        if(bet[0].val === 0 || bet[0].opt === opt){
            newBet[0].val += val;
            newBet[0].opt = opt;
            if(newBet[0].val === 0) newBet[0].opt = -1;
        }
        else if(bet[1].val === 0 || bet[1].opt === opt){
            newBet[1].val += val;
            newBet[1].opt = opt;
            if(newBet[1].val === 0) newBet[1].opt = -1;
        }
        setCash(cash - val);
        setBet(newBet);
    }

    function onBetConfirm(){
        setDataSent(true);
        setClick(click +1);
    }

    //**********************/
    //Rendering functions:
    /***********************/

    function renderWaitForProgress(){
        return (
            <div className={"HostMenu"}>
                Waiting...
            </div>
        )
    }

    function renderWaitForAnswer(){
        if(dataSent) return (renderWaitForProgress());
        return (
            <div className="narrow">
                <StringInput
                    type="number"
                    description={"Suggest what might be a correct answer for the question:"}
                    editVal={ans.toString()}
                    errorMsg={""}
                    onChange={(newValue) => onAnsChange(newValue)}
                />
                <img
                    className="q-btn-img"
                    src={images["q-play"]}
                    alt={"confirm"}
                    onClick={onAnsConfirm}
                />
            </div>
        )
    }

    function renderWaitForBets(){
        if(dataSent) return (renderWaitForProgress());
        console.log(bet);
        return (
            <div className="narrow">
                <BetInput
                    opts={betOptions}
                    bet={bet}
                    cash={cash}
                    color={color}
                    onClickBet={(opt, val) => onBetClick(opt, val)}
                    onBetConfirm={() => onBetConfirm()}
                />
            </div>
        )
    }

    function renderCash(){
        var fade = "";
        if(cash <= 0) {
            fade = " fade";
        }
        return (
            <div className={"txt-img-box" + fade}>
                <img
                    className={"txt-img-img"}
                    src={images["coin"+color]}
                    alt={"coin"+color}
                />
                <div className="txt-img-txt">{cash}</div>
            </div>
        );
    }

    function renderGameState(){
        if(gameState === GameState.LOADING)
        {
            return (
                <div className={"HostMenu"}>
                    LOADING...
                </div>
            )
        }
        else if(gameState === GameState.WAIT_FOR_PLAYERS)
        {
            return (
                <div className={"HostMenu"}>
                    Waiting for players to join and for host to start the quiz.
                </div>
            )
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
            return (
                <div className={"HostMenu"}>
                    Did you bet like many others?
                </div>
            )
        }
        else if(gameState === GameState.SHOW_CORRECT)
        {
            var txt = "Wohoo, you won " + won;
            if(won <= 2) txt = "Oh no, you did not win :( ";
            return (
                <div className={"HostMenu"}>
                    {txt}
                </div>
            )
        }
        else if(gameState === GameState.SHOW_STANDINGS)
        {
            return (
                <div className={"HostMenu"}>
                    Are you winning?
                </div>
            )
        }
    }
    
    return (
        <div className="narrow col center">
            <div className="HostMenu">
                {"Game: " + props.gid}
            </div>
            <div className="HostMenu">
                {"Name: " + props.name}
            </div>
            {renderCash()}
            {renderGameState()}
        </div>
    )
}

export default PlayGame;