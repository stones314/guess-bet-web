import React from "react";
import LogInMenu from "./host/LogInMenu";
import {images} from "./helper/Consts";
import { useState } from "react";
import JoinMenu from "./player/JoinMenu";
import './styles/EditQuiz.css';
import './App.css';

const LOADING = 0;
const HOST_VS_JOIN = 1;
const HOST_MENU = 2;
const JOIN_MENU = 3;

function App() {

    const [pageState, setPageState] = useState(HOST_VS_JOIN);

    function onClickHost() {
        setPageState(HOST_MENU);
    }

    function onClickJoin() {
        setPageState(JOIN_MENU);
    }

    function onClickExit() {
        setPageState(HOST_VS_JOIN);
    }

    if(pageState === LOADING)
    {
        return (
            <div className={"wide col center trans-mid"}>
                Loading...
            </div>
        )
    }
    else if(pageState === HOST_VS_JOIN)
    {
        return (
            <div className={"wide col center trans-mid"}>
                <h2>QUIZ !</h2>
                
                <div className={"col m6"}>
                    <img
                        className="join-btn-img"
                        src={images["join"]}
                        alt={"join"}
                        onClick={() => onClickJoin()}
                    />
                    Bli med
                </div>
                <div className={"col m6"}>
                    <img
                        className="host-btn-img"
                        src={images["host"]}
                        alt={"host"}
                        onClick={() => onClickHost()}
                    />
                    Arranger
                </div>
            </div>
        )
    }
    else if(pageState === HOST_MENU)
    {
        return (
            <div className={"wide col center trans-mid"}>
                <h2>QUIZ !</h2>
                <LogInMenu
                    onClickExit={() => onClickExit()}
                />
            </div>
        )
    }
    else if(pageState === JOIN_MENU)
    {
        return (
            <div className={"wide col center trans-mid"}>
                <h2>QUIZ !</h2>
                <JoinMenu
                    onClickExit={() => onClickExit()}
                />
            </div>
        )
    }
}

export default App;