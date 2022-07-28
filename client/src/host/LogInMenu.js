import React, { useState } from "react";
import {images, SERVER} from "./../helper/Consts";
import StringInput from "../helper/StringInput";
import HostMenu from "./HostMenu";
import './../styles/EditQuiz.css';
import {T} from "../helper/Translate";

const ENTER_CREDENTIALS = 0;
const HOST_MENU = 1;

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
            setPerr(T("Wrong password. Forgot it? Ask Steinar :)",props.lang));
            setNerr("");
        }
        else {
            setPerr("Unknown error");
            setNerr("Unknown error");
        }
    }

    function onClickPlay() {
        if (name === ""){
            setNerr(T("Enter a name",props.lang));
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
                <h3>{T("Log On / Sign Up", props.lang)}</h3>
                <div className={"narrow"}>
                    <div className="m6">{T("Create new account by logging in with a new user name and password.",props.lang)}</div>
                    <div className="m6 red">{T("Note: Password is sent and stored in readable text on the server. Do not use a password that should be secret!",props.lang)}</div>
                    <StringInput
                        description={T("Name:",props.lang)}
                        type="text"
                        editVal={name}
                        errorMsg={nErr}
                        onChange={(newValue) => onNameChange(newValue)}
                        onEnterDown={(e) => {e.preventDefault(); onClickPlay()}}
                    />
                    <StringInput
                        type="password"
                        description={T("Password:",props.lang)}
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
                    lang={props.lang}
                    user={name}
                    onClickExit={() => onClickExit()}
                />
            </div>
        )
    }
}

export default LogInMenu;