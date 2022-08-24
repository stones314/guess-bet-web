import React, { useState } from "react";
import {images, SERVER} from "./../helper/Consts";
import StringInput from "../helper/StringInput";
import PlayGame from "./PlayGame";
import './../styles/EditQuiz.css';
import Cookies from "universal-cookie";
import { T, FlagSelect } from "../helper/Translate";

const ENTER_CREDENTIALS = 0;
const PLAY_GAME = 1;
const ABORTED_GAME = 2;

function JoinMenu(props) {
    const cookies = new Cookies();
    const [pageState, setPageState] = useState(ENTER_CREDENTIALS);
    const [name, setName] = useState(cookies.get("lastName") ? cookies.get("lastName") : "");
    const [gid, setGid] = useState(cookies.get("lastGid") ? cookies.get("lastGid") : "");
    const [nErr, setNerr] = useState("");
    const [gErr, setGerr] = useState("");
    const [lang, setLang] = useState("engelsk");
    const [showLangOpts, setShowLangOpts] = useState(false);
    
    function onClickShowOpts(){
        setShowLangOpts(true);
    }

    function onClickLang(newLang){
        setShowLangOpts(false);
        setLang(newLang);
    }

    function onNameChange(newValue) {
        if (newValue.length > 10) return;
        setName(newValue);
    }

    function onGidChange(newValue) {
        newValue.trim();
        setGid(newValue);
    }

    function onResponse(canJoin){
        if(canJoin === 1) {
            setGerr("");
            setNerr("");
            setPageState(PLAY_GAME);
        }
        else if(canJoin === 2) {
            setGerr(T("Invalid Quiz ID",lang));
            setNerr("");
        }
        else if(canJoin === 3) {
            setGerr("");
            setNerr(T("Name already in use",lang));
        }
        else {
            setGerr("Unknown error");
            setNerr("Unknown error");
        }
    }

    function onClickPlay() {
        if (name === ""){
            setNerr(T("Enter a name",lang));
            setGerr("");
            return;
        }
        if(!gid){
            setNerr("");
            setGerr(T("Enter Quiz ID",lang));
            return;
        }
        cookies.set("lastName", name, {path: "/"});
        cookies.set("lastGid", gid, {path: "/"});
        fetch(SERVER + "/can-join-quiz", {
            method: 'POST',
            body: JSON.stringify({
                gid : gid.trim(),
                name : name.trim()
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((data) => onResponse(data.ok));
    }

    function onGameAbort() {
        cookies.set("lastGid", "", {path: "/"});
        setPageState(ABORTED_GAME);
    }

    function renderMenu() {
        return (
            <div className="narrow center">
                <div className={"narrow"}>
                    <StringInput
                        description={T("Name:",lang)}
                        type="text"
                        editVal={name}
                        errorMsg={nErr}
                        onChange={(newValue) => onNameChange(newValue)}
                        onEnterDown={(e) => {e.preventDefault(); onClickPlay()}}
                    />
                    <StringInput
                        type="number"
                        description={"Quiz ID:"}
                        editVal={gid.toString()}
                        errorMsg={gErr}
                        onChange={(newValue) => onGidChange(newValue)}
                        onEnterDown={(e) => {e.preventDefault(); onClickPlay()}}
                    />
                </div>
                <div className="row m6">
                    <div className="f1">
                        <img
                            className="q-btn-img"
                            src={images["play"]}
                            alt={"play"}
                            onClick={onClickPlay}
                        />
                    </div>
                </div>
            </div>
        )
    }

    if(pageState === ENTER_CREDENTIALS)
    {
        return (
            <div className={"wide col center trans-mid"}>
                <FlagSelect
                    lang={lang}
                    showLangs={showLangOpts}
                    onClickLang={(newLang) => onClickLang(newLang)}
                    onClickShowOpts={onClickShowOpts}
                />
                <h2>QUIZ !</h2>
                {renderMenu()}
            </div>
        )
    }
    else if(pageState === PLAY_GAME)
    {
        return (
            <div className={"wide col center trans-mid"}>
                <h2>QUIZ !</h2>
                <PlayGame
                    lang={lang}
                    gid={gid}
                    name={name}
                    onGameAbort={onGameAbort}
                    onClickExit={() => {
                        setPageState(ENTER_CREDENTIALS)
                    }}
                />
            </div>
        )
    }
    else if(pageState === ABORTED_GAME)
    {
        return (
            <div className={"wide col center trans-mid"}>
                <FlagSelect
                    lang={lang}
                    showLangs={showLangOpts}
                    onClickLang={(newLang) => onClickLang(newLang)}
                    onClickShowOpts={onClickShowOpts}
                />
                <h2>QUIZ !</h2>
                {T("Oh No! The host got disconnected :(",lang)}
                {renderMenu()}
            </div>
        )
    }
}

export default JoinMenu;