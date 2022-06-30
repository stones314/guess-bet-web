import React from "react";
import CreateQuiz from "./CreateQuiz";
import QuizListElement from "./QuizListElement";
import {images, SERVER} from "./../helper/Consts";
import HostPlay from "./HostPlay";
import { useState } from "react";
import { useEffect } from "react";

const LOADING = -1;
const SHOW_MENU = 0;
const CREATE_QUIZ = 1;
const HOST_GAME = 2;

function HostMenu(props) {
    console.log("HostMenu rendered");

    const [pageState, setPageState] = useState(LOADING);
    const [quizList, setQuizList] = useState([]);
    const [quizIndex, setQuizIndex] = useState(-1);

    useEffect(() => {
        loadQuizList();
    }, []);

    function onClickNewQuiz() {
        setPageState(CREATE_QUIZ);
    }

    function onQuizSaved(){
        setPageState(SHOW_MENU);
        loadQuizList();
    }

    function onQuizEdit(index){
        setQuizIndex(index);
        setPageState(CREATE_QUIZ);
    }

    function onQuizDelete(index){
        fetch(SERVER + "/delete-quiz", {
            method: 'POST',
            body: JSON.stringify({
                index : index 
                }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((data) => console.log(data));
        loadQuizList();
    }

    function onQuizPlay(index) {
        setQuizIndex(index);
        setPageState(HOST_GAME);
    }

    function loadQuizList(){
        console.log("load quiz list");
        var qs = [];

        fetch(SERVER + "/load-quiz-list")
            .then((res) => res.json())
            .then((data) => {
                console.log("loaded!");
                for(const [i,q] of data.quizlist.entries()){
                    qs.push(
                    <QuizListElement
                        key={i}
                        name={q.name}
                        length={q.length}
                        onClickEdit={() => onQuizEdit(i)}
                        onClickDelete={() => onQuizDelete(i)}
                        onClickPlay={() => onQuizPlay(i)}
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
            <div className="hm-box">
                <div className={"hm-play"}>
                    Quiz List:
                </div>
                <div className={"hm-play"}>
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
            <div className={"HostMenu"}>
                LOADING
            </div>
        )
    }
    else if(pageState === SHOW_MENU)
    {
        return (
            <div className={"HostMenu"}>
                {renderMenu()}
            </div>
        )
    }
    else if(pageState === CREATE_QUIZ)
    {
        return (
            <div className={"HostMenu"}>
                <CreateQuiz
                    editQuizIndex = {quizIndex}
                    onQuizSaved = {() => onQuizSaved()}
                />
            </div>
        )
    }
    else if(pageState === HOST_GAME)
    {
        return (
            <div className={"HostMenu"}>
                <HostPlay
                    quizIndex = {quizIndex}
                    onClickExit = {() => onQuizSaved()}
                />
            </div>
        )
    }
}

export default HostMenu;