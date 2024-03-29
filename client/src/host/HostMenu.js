import React from "react";
import CreateQuiz from "./CreateQuiz";
import QuizListElement from "./QuizListElement";
import {images, SERVER} from "./../helper/Consts";
import HostGame from "./HostGame";
import { useState } from "react";
import { useEffect } from "react";
import {T} from "../helper/Translate";

const LOADING = -1;
const SHOW_MENU = 0;
const CREATE_QUIZ = 1;
const HOST_GAME = 2;

function HostMenu(props) {
    const [pageState, setPageState] = useState(LOADING);
    const [quizList, setQuizList] = useState([]);
    const [quizFile, setQuizFile] = useState("");

    useEffect(() => {
        loadQuizList();
    }, []);

    function onClickNewQuiz() {
        setQuizFile("");
        setPageState(CREATE_QUIZ);
    }

    function onQuizSaved(){
        loadQuizList();
    }

    function onClickBack(){
        loadQuizList();
    }

    function onQuizEdit(file){
        setQuizFile(file);
        setPageState(CREATE_QUIZ);
    }

    function onQuizDelete(file){
        fetch(SERVER + "/delete-quiz", {
            method: 'POST',
            body: JSON.stringify({
                user : props.user,
                file : file 
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((data) => loadQuizList());
    }

    function onQuizPlay(file) {
        setQuizFile(file);
        setPageState(HOST_GAME);
    }

    function loadQuizList(stateAfter = SHOW_MENU){
        var qs = [];

        fetch(SERVER + "/load-quiz-list", {
            method: 'POST',
            body: JSON.stringify({
                user : props.user,
                load : true 
                }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((data) => {
            for(const [i,q] of data.quizlist.entries()){
                qs.push(
                <QuizListElement
                    key={i}
                    user={props.user}
                    name={q.name}
                    length={q.length}
                    file={q.file}
                    lang={q.lang}
                    onClickEdit={() => onQuizEdit(q.file)}
                    onClickDelete={() => onQuizDelete(q.file)}
                    onClickPlay={() => onQuizPlay(q.file)}
                />
                );
            }
            setQuizList(qs);
            setPageState(stateAfter);
        });
    }

    function renderMenu() {
        return (
            <div className="">
                <div className={"fs20 m3"}>
                    {T("Your quizes:",props.lang)}
                </div>
                <div className={"col"}>
                    {quizList}
                </div>
                <div className={"row"}>
                    <div className={"items-left"}>
                        <img
                            className="q-btn-img"
                            src={images["back"]}
                            alt={"exit"}
                            onClick={() => props.onClickExit()}
                        />
                    </div>
                    <div className={"items-right"}>
                        <img
                            className="q-btn-img"
                            src={images["add"]}
                            alt={"add"}
                            onClick={() => onClickNewQuiz()}
                        />
                    </div>
                </div>
            </div>
        )
    }

    if(pageState === LOADING)
    {
        return (
            <div className="wide">
                {T("Loading...",props.lang)}
            </div>
        )
    }
    else if(pageState === SHOW_MENU)
    {
        return (
            <div className="wide">
                {renderMenu()}
            </div>
        )
    }
    else if(pageState === CREATE_QUIZ)
    {
        return (
            <div className="wide">
                <CreateQuiz
                    lang={props.lang}
                    user={props.user}
                    quizFile = {quizFile}
                    onQuizSaved = {() => onQuizSaved()}
                    onClickBack = {() => onClickBack()}
                />
            </div>
        )
    }
    else if(pageState === HOST_GAME)
    {
        return (
            <div className="wide txt-left">
                <HostGame
                    lang={props.lang}
                    user={props.user}
                    quizFile = {quizFile}
                    onClickExit = {() => props.onClickExit()}
                />
            </div>
        )
    }
}

export default HostMenu;