import React, { useState } from "react";
import {images, SERVER} from "./../helper/Consts";
import StringInput from "../helper/StringInput";

const ENTER_CREDENTIALS = 0;
const PLAY_GAME = 1;

function JoinMenu(props) {
    console.log("JointMenu rendered");

    const [pageState, setPageState] = useState(ENTER_CREDENTIALS);
    const [name, setName] = useState("");
    const [gid, setGid] = useState(0);
    const [nErr, setNerr] = useState("");
    const [gErr, setGerr] = useState("");

    function onNameChange(newValue) {
        setName(newValue);
    }

    function onGidChange(newValue) {
        var newGid = Number.parseInt(newValue);
        if(newGid)
            setGid(newValue);
    }

    function onResponse(canJoin){
        console.log("Response " + canJoin);
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

    function onClickPlay(index) {
        console.log("Click Play");
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

    function renderMenu() {
        return (
            <div className="hm-box">
                <div className={"hm-play"}>
                    <StringInput
                        description={"User Name:"}
                        editVal={name}
                        errorMsg={nErr}
                        onChange={(newValue) => onNameChange(newValue)}
                    />
                    <StringInput
                        description={"Game Id:"}
                        editVal={gid.toString()}
                        errorMsg={gErr}
                        onChange={(newValue) => onGidChange(newValue)}
                    />
                </div>
                <div className={"hm-play"} onClick={() => onClickPlay()}>
                    PLAY
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
                PLAY GAME TODO
            </div>
        )
    }
}

export default JoinMenu;