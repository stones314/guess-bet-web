import React, { useState } from "react";
import {images, SERVER} from "./../helper/Consts";
import StringInput from "../helper/StringInput";
import HostMenu from "./HostMenu";
import './../styles/EditQuiz.css';

const ENTER_CREDENTIALS = 0;
const HOST_MENU = 1;
const ABORTED_GAME = 2;

function LogInMenu(props) {
    const [pageState, setPageState] = useState(ENTER_CREDENTIALS);
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [nErr, setNerr] = useState("");
    const [pErr, setPerr] = useState("");

    function onNameChange(newValue) {
        if (newValue.length > 10) return;
        setName(newValue);
    }

    function onPwdChange(newValue) {
        setPwd(newValue);
    }

    function onResponse(ok){
        if(ok === 1 || ok === 2) {
            setPerr("");
            setNerr("");
            setPageState(HOST_MENU);
        }
        else if(ok === 0) {
            setPerr("Feil passord! Glemt passord? Kontakt Steinar!");
            setNerr("");
        }
        else {
            setPerr("Unknown error");
            setNerr("Unknown error");
        }
    }

    function onClickPlay() {
        if (name === ""){
            setNerr("Enter a name");
            setPerr("");
            return;
        }
        fetch(SERVER + "/log-in", {
            method: 'POST',
            body: JSON.stringify({
                user : name.trim(),
                pwd : pwd
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((data) => onResponse(data.ok));
    }

    function onClickExit() {
        setPwd("");
        setPageState(ENTER_CREDENTIALS);
    }

    function renderMenu() {
        return (
            <div className="narrow center">
                <h3>Logg på / Lag bruker</h3>
                <div className={"narrow"}>
                    <div className="m6">Hvis brukernavn ikkje finnes frå før blir det laget ny bruker.</div>
                    <div className="m6 red">Merk: Passord sendes ukryptert og lagres i klartekst på server. Ikkje bruk et passord som du bruker andre steder!</div>
                    <StringInput
                        description={"Navn:"}
                        type="text"
                        editVal={name}
                        errorMsg={nErr}
                        onChange={(newValue) => onNameChange(newValue)}
                        onEnterDown={(e) => {e.preventDefault(); onClickPlay()}}
                    />
                    <StringInput
                        type="password"
                        description={"Passord:"}
                        editVal={pwd.toString()}
                        errorMsg={pErr}
                        onChange={(newValue) => onPwdChange(newValue)}
                        onEnterDown={(e) => {e.preventDefault(); onClickPlay()}}
                    />
                </div>
                <div className="row m6">
                    <div className="f1">
                    <img
                        className="q-btn-img"
                        src={images["back"]}
                        alt={"exit"}
                        onClick={() => props.onClickExit()}
                    />
                    </div>
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
            <div className={"HostMenu"}>
                {renderMenu()}
            </div>
        )
    }
    else if(pageState === HOST_MENU)
    {
        return (
            <div className={"HostMenu"}>
                <HostMenu
                    user={name}
                    onClickExit={() => onClickExit()}
                />
            </div>
        )
    }
}

export default LogInMenu;