import React, {useState, useRef, useEffect} from "react";
import {images, GameState} from "./../helper/Consts";
import BetBoard from "./BetBoard";
import PlayerInfo from "./PlayerInfo";

function HostGame(props) {
    const [gameState, setGameState] = useState(GameState.LOADING);
    const [gid, setGid] = useState(-1);
    const [quiz, setQuiz] = useState(null);
    const [qid, setQid] = useState(-1);
    const [players, setPlayers] = useState([]);
    const [click, setClick] = useState(0);
    const [betOpts, setBetOpts] = useState([]);
    const ws = useRef(null);

    //Connect to server with WS Socket. This runs only once:
    //Handles connect and all messages received from server
    useEffect(() => {
        ws.current = new WebSocket("ws://16.170.74.73:1337");
        const apiCall = {
            type: "host-game",
            quizId: props.quizIndex,
        };
        ws.current.onopen = (event) => {
            ws.current.send(JSON.stringify(apiCall));
        };
        ws.current.onclose = (event) => {
            console.log("ws closed");
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
            if(data.type === "host-game") {
                onGameStarted(data);
            }
            else if(data.type === "join-game") {
                console.log("handle join " + data.name);
                onPlayerUpdate(data);
            }
            else if(data.type === "left-game") {
                onPlayerUpdate(data);
            }
            else if(data.type === "step-game") {
                onStepGame(data);
            }
            else if(data.type === "player-ans") {
                onPlayerUpdate(data);
            }
            else if(data.type === "player-bet") {
                onPlayerUpdate(data);
            }
            else if(data.type === "bet-opts") {
                onBetOpts(data);
            }
        }
        
        function onGameStarted(data) {
            setGameState(GameState.WAIT_FOR_PLAYERS);
            setGid(data.gid);
            setQuiz(data.quiz);
            setQid(0);
        }
        function onPlayerUpdate(data) {
            setPlayers(data.data);
        }
        function onBetOpts(data) {
            setBetOpts(data.betOpts);
        }
        function onStepGame(data) {
            setGameState(data.newState);
            setPlayers(data.data);
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
        else if(gameState >= GameState.WAIT_FOR_PLAYERS && gameState <= GameState.SHOW_STANDINGS){
            ws.current.send(JSON.stringify({
                type : "step-game",
                state : gameState
            }));
        }
      }, [click]);


    function onClickContinue() {
        setClick(click + 1);
    }

    //**********************/
    //Rendering functions:
    /***********************/

    function renderContinue() {
        return (
        <img
            className="q-btn-img"
            src={images["q-play"]}
            alt={"continue"}
            onClick={onClickContinue}
        />
        )
    }

    function renderPlayerInfo(){
        var pList = [];
        var hdr = {
            name : "Name",
            cash : "Cash",
            ans : "Ans",
            bet : "Bet"
        }
        pList.push(
            <PlayerInfo
                key={-1}
                pInfo={hdr}
                gameState={gameState}
                isHdr={true} 
            />
        );
        for(const [i, p] of players.entries()){
            pList.push(
                <PlayerInfo
                    key={i}
                    pInfo={p}
                    gameState={gameState}
                    isHdr={false}
                />
            );
        }
        return(
            <div className="col">
                {pList}
            </div>
        )
    }

    function renderGameBoard() {
        return (
            <div>
                <BetBoard
                    pData={players}
                    opts={betOpts}
                    gameState={gameState}
                />
            </div>
        )
    }

    function renderWaitForPlayers() {
        return (
            <div>
                <div>
                    Name: {quiz.name} <br/>
                    Lenght: {quiz.questions.length} <br/>
                    <br/>
                    Game Id: {gid}<br/>
                    <br/>
                    PLAYERS:
                    <br/>
                    {renderPlayerInfo()}
                    <br/>
                    WAITING FOR PLAYERS!
                </div>
            </div>
        )
    }

    function renderWaitForAnswers() {
        return (
            <div>
                <div>
                    Question {(qid + 1) + " of " + quiz.questions.length}
                </div>
                <div>
                    {quiz.questions[qid].text}
                </div>
                <div>
                    Answer should be given in {quiz.questions[qid].unit}
                </div>
                <div>
                    Answering:
                </div>
                <div>
                    {renderPlayerInfo()}
                </div>
            </div>
        )
    }

    function renderWaitForBets() {
        return (
            <div>
                <div>
                    Question {(qid + 1) + " of " + quiz.questions.length}
                </div>
                <div>
                    {quiz.questions[qid].text}
                </div>
                <div>
                    Answer should be given in {quiz.questions[qid].unit}
                </div>
                <div>
                    Betting:
                </div>
                <div>
                    {renderPlayerInfo()}
                </div>
                <div>{renderGameBoard()}</div>
            </div>
        )
    }

    function renderGameState(){
        if(gameState === GameState.LOADING)
        {
            return ("LOADING")
        }
        else if(gameState === GameState.WAIT_FOR_PLAYERS)
        {
            return (renderWaitForPlayers())
        }
        else if(gameState === GameState.WAIT_FOR_ANSWERS)
        {
            return (renderWaitForAnswers())
        }
        else if(gameState >= GameState.WAIT_FOR_BETS && gameState < GameState.GAME_OVER)
        {
            return ( renderWaitForBets() )
        }
        else if(gameState === GameState.GAME_OVER)
        {
            return (<div>GAME OVER</div>)
        }
    }

    return (
        <div className={"col"}>
            <div className={"col"}>
                {renderGameState()}
            </div>
            <div className={"col center"}>
                {renderContinue()}
            </div>
        </div>
    )
}

export default HostGame;