import React from "react";
import CreateQuiz from "./CreateQuiz";
import QuizListElement from "./QuizListElement";
import {images, SERVER} from "./../helper/Consts";
import HostGame from "./HostPlay";
import { useState } from "react";
import { useEffect } from "react";

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
        setPageState(SHOW_MENU);
    }

    function onQuizEdit(file){
        setQuizFile(file);
        setPageState(CREATE_QUIZ);
    }

    function onQuizDelete(file){
        fetch(SERVER + "/delete-quiz", {
            method: 'POST',
            body: JSON.stringify({
                file : file 
                }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((data) => console.log(data));
        loadQuizList();
    }

    function onQuizPlay(file) {
        setQuizFile(file);
        setPageState(HOST_GAME);
    }

    function loadQuizList(){
        console.log("load quiz list");
        var qs = [];

        fetch(SERVER + "/load-quiz-list", {
            method: 'POST',
            body: JSON.stringify({
                load : true 
                }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("loaded!");
            for(const [i,q] of data.quizlist.entries()){
                qs.push(
                <QuizListElement
                    key={i}
                    name={q.name}
                    length={q.length}
                    file={q.file}
                    onClickEdit={() => onQuizEdit(q.file)}
                    onClickDelete={() => onQuizDelete(q.file)}
                    onClickPlay={() => onQuizPlay(q.file)}
                />
                );
            }
            setQuizList(qs);
            if(pageState === LOADING){
                setPageState(SHOW_MENU);
            }
        });
    }

    function renderMenu() {
        return (
            <div className="narrow">
                <div className={"hm-play"}>
                    Quiz List:
                </div>
                <div className={"col"}>
                    {quizList}
                </div>
                <div className={"hm-create"}>
                    <img
                        className="q-btn-img"
                        src={images["q-add"]}
                        alt={"add new quiz"}
                        onClick={() => onClickNewQuiz()}
                    />
                </div>
                <div className={"hm-exit"}>
                    <img
                        className="hm-img"
                        src={images["hm-exit"]}
                        alt={"exit"}
                        onClick={() => props.onClickExit()}
                    />
                    EXIT
                </div>
            </div>
        )
    }

    if(pageState === LOADING)
    {
        return (
            <div className="wide">
                LOADING
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
                    quizFile = {quizFile}
                    onQuizSaved = {() => onQuizSaved()}
                />
            </div>
        )
    }
    else if(pageState === HOST_GAME)
    {
        return (
            <div className="wide txt-left">
                <HostGame
                    quizFile = {quizFile}
                    onClickExit = {() => onQuizSaved()}
                />
            </div>
        )
    }
}

export default HostMenu;