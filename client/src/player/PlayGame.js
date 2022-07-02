import React, {useState, useRef, useEffect} from "react";
import {images, GameState} from "./../helper/Consts";
import StringInput from "../helper/StringInput";
import BetInput from "./BetInput";

function PlayGame(props) {
    console.log("HostMenu rendered");

    const [gameState, setPageState] = useState(GameState.LOADING);
    const [ans, setAns] = useState("");
    const [bet, setBet] = useState([]);
    const [betOptions, setBetOptions] = useState([]);
    const [cash, setCash] = useState(2);
    const [dataSent, setDataSent] = useState(false);
    const [click, setClick] = useState(0);
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
            else if(data.type === "end-game") {
                props.onGameAbort();
            }
        }
        
        function onGameStarted(data) {
            console.log("Game Started : " + data);
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
            setCash(data.cash)
            setPageState(GameState.SHOW_STANDINGS);
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
                ans : ans
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
        setClick(click +1);
    }

    function onAnsConfirm(){
        setDataSent(true);
        setClick(click +1);
    }

    function onBetClick(optNo, ammount){

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
            <div className={"HostMenu"}>
                <StringInput
                    type="number"
                    description={"Suggest what might be a correct answer for the quiestion:"}
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
        return (
            <div className={"HostMenu"}>
                <BetInput
                    opts={betOptions}
                    bet={bet}
                    cash={cash}
                    onBetClick={(opt, val) => onBetClick(opt, val)}
                    onBetConfirm={() => onBetConfirm()}
                />
            </div>
        )
    }

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
    else if(gameState >= GameState.SHOW_BETS && gameState <= GameState.SHOW_STANDINGS)
    {
        return (
            <div className={"HostMenu"}>
                No user input required here!
            </div>
        )
    }
}

export default PlayGame;