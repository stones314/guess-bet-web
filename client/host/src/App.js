import React from "react";
import LogInMenu from "./host/LogInMenu";
import {images} from "./helper/Consts";
import { useState } from "react";
import JoinMenu from "./player/JoinMenu";
import './styles/EditQuiz.css';
import './App.css';
import { T, FlagSelect } from "./helper/Translate";

const LOADING = 0;
const HOST_VS_JOIN = 1;
const HOST_MENU = 2;
const JOIN_MENU = 3;

function App() {

    const [pageState, setPageState] = useState(HOST_VS_JOIN);
    const [lang, setLang] = useState("engelsk");
    const [showLangOpts, setShowLangOpts] = useState(false);
    
    function onClickShowOpts(){
        setShowLangOpts(true);
    }

    function onClickLang(newLang){
        setShowLangOpts(false);
        setLang(newLang);
    }

    function onClickHost() {
        setShowLangOpts(false);
        setPageState(HOST_MENU);
    }

    function onClickJoin() {
        setShowLangOpts(false);
        setPageState(JOIN_MENU);
    }

    function onClickExit() {
        setShowLangOpts(false);
        setPageState(HOST_VS_JOIN);
    }

    function renderHeader() {
        return(
            <div>
                <h2>QUIZ !</h2>
                <FlagSelect
                    lang={lang}
                    showLangs={showLangOpts}
                    onClickLang={(newLang) => onClickLang(newLang)}
                    onClickShowOpts={onClickShowOpts}
                />
            </div>
        );
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
                {renderHeader()}
                <div className={"col m6"}>
                    <img
                        className="join-btn-img"
                        src={images["join"]}
                        alt={"join"}
                        onClick={() => onClickJoin()}
                    />
                    {T("Join",lang)}
                </div>
                <div className={"col m6"}>
                    <img
                        className="host-btn-img"
                        src={images["host"]}
                        alt={"host"}
                        onClick={() => onClickHost()}
                    />
                    {T("Host",lang)}
                </div>
            </div>
        )
    }
    else if(pageState === HOST_MENU)
    {
        return (
            <div className={"wide col center trans-mid"}>
                {renderHeader()}
                <LogInMenu
                    lang={lang}
                    onClickExit={() => onClickExit()}
                />
            </div>
        )
    }
    else if(pageState === JOIN_MENU)
    {
        return (
            <div className={"wide col center trans-mid"}>
                {renderHeader()}
                <JoinMenu
                    lang={lang}
                    onClickExit={() => onClickExit()}
                />
            </div>
        )
    }
}

export default App;