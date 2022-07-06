import React, { useState } from "react";
import {images, SERVER} from "./../helper/Consts";
import StringInput from "../helper/StringInput";
import PlayGame from "./PlayGame";
import './../styles/EditQuiz.css';

const ENTER_CREDENTIALS = 0;
const PLAY_GAME = 1;
const ABORTED_GAME = 2;

function JoinMenu(props) {
    const [pageState, setPageState] = useState(ENTER_CREDENTIALS);
    const [name, setName] = useState("");
    const [gid, setGid] = useState("");
    const [nErr, setNerr] = useState("");
    const [gErr, setGerr] = useState("");

    function onNameChange(newValue) {
        setName(newValue);
    }

    function onGidChange(newValue) {
        setGid(newValue);
    }

    function onResponse(canJoin){
        if(canJoin === 1) {
            setGerr("");
            setNerr("");
            setPageState(PLAY_GAME);
        }
        else if(canJoin === 2) {
            setGerr("Invalid Game Id");
            setNerr("");
        }
        else if(canJoin === 3) {
            setGerr("");
            setNerr("User Name already in use");
        }
        else {
            setGerr("Unknown error");
            setNerr("Unknown error");
        }
    }

    function onClickPlay() {
        if (name === ""){
            setNerr("Enter a name");
            setGerr("");
            return;
        }
        if(!gid){
            setNerr("");
            setGerr("Enter game id");
            return;
        }
        fetch(SERVER + "/can-join-quiz", {
            method: 'POST',
            body: JSON.stringify({
                gid : gid,
                name : name 
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((data) => onResponse(data.ok));
    }

    function onGameAbort() {
        setPageState(ABORTED_GAME);
    }

    function renderMenu() {
        return (
            <div className="narrow">
                <div className={"narrow"}>
                    <StringInput
                        description={"User Name:"}
                        type="text"
                        editVal={name}
                        errorMsg={nErr}
                        onChange={(newValue) => onNameChange(newValue)}
                    />
                    <StringInput
                        type="number"
                        description={"Game Id:"}
                        editVal={gid.toString()}
                        errorMsg={gErr}
                        onChange={(newValue) => onGidChange(newValue)}
                    />
                </div>
                <div className={"hm-play"}>
                    <img
                        className="q-btn-img"
                        src={images["play"]}
                        alt={"play"}
                        onClick={onClickPlay}
                    />
                </div>
            </div>
        )
    }

    if(pageState === ENTER_CREDENTIALS)
    {
        return (
            <div className={"HostMenu"}>
                {renderMenu()}
            </div>
        )
    }
    else if(pageState === PLAY_GAME)
    {
        return (
            <div className={"HostMenu"}>
                <PlayGame
                    gid={gid}
                    name={name}
                    onGameAbort={onGameAbort}
                    onClickExit={() => props.onClickExit()}
                />
            </div>
        )
    }
    else if(pageState === ABORTED_GAME)
    {
        return (
            <div className={"HostMenu"}>
                Whoops! Den som haldt quizen mista kontakten med serveren...
                {renderMenu()}
            </div>
        )
    }
}

export default JoinMenu;