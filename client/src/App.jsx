import React from "react";
import HostMenu from "./host/HostMenu";
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
    console.log("App rendered");

    const [pageState, setPageState] = useState(HOST_VS_JOIN);

    function onClickHost() {
        setPageState(HOST_MENU);
    }

    function onClickJoin() {
        setPageState(JOIN_MENU);
    }

    function onClickExitHost() {
        setPageState(HOST_VS_JOIN);
    }

    if(pageState === LOADING)
    {
        return (
            <div className={"col center"}>
                Loading...
            </div>
        )
    }
    else if(pageState === HOST_VS_JOIN)
    {
        return (
            <div className={"col center"}>
                <h1>QUIZ !</h1>
                
                <div className={"app-btn"}>
                    <img
                        className="app-btn-img"
                        src={images["app-host"]}
                        alt={"host"}
                        onClick={() => onClickHost()}
                    />
                    HOST
                </div>
                <div className={"app-btn"}>
                    <img
                        className="app-btn-img"
                        src={images["app-join"]}
                        alt={"join"}
                        onClick={() => onClickJoin()}
                    />
                    JOIN
                </div>
            </div>
        )
    }
    else if(pageState === HOST_MENU)
    {
        return (
            <div className={"col center"}>
                <h1>QUIZ !</h1>
                <HostMenu
                    onClickExit={() => onClickExitHost()}
                />
            </div>
        )
    }
    else if(pageState === JOIN_MENU)
    {
        return (
            <div className={"col center"}>
                <h1>QUIZ !</h1>
                <JoinMenu/>
            </div>
        )
    }
}

export default App;