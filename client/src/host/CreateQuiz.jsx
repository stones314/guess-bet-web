import React from "react";
import Question from "./Question";
import {images, SERVER, MIN_INF} from "./../helper/Consts";
import './../styles/EditQuiz.css';
import StringInput from "../helper/StringInput";
import { T } from "../helper/Translate";

class CreateQuiz extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            questions: [],
            editIndex: -1,
            name : "",
        }
    }

    componentDidMount() {
        if(this.props.quizFile !== ""){
            fetch(SERVER + "/load-quiz", {
                method: 'POST',
                body: JSON.stringify({
                    user: this.props.user,
                    file : this.props.quizFile
                }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    questions : data.quiz.questions,
                    name : data.quiz.name,
                    loading : false
                });
        });
        }
        else{
            this.setState({loading : false});
        }
    }

    onQSubmit(event, index) {
        event.preventDefault();
        this.setState({editIndex : -1});
    }

    onQChange(newValue, index, field) {
        if(index < this.state.questions.length){
            var qs = this.state.questions.slice();
            qs[index][field] = newValue;
            this.setState({questions : qs});
        }
    }

    onNameChange(newValue) {
        this.setState({name : newValue});
    }

    onClickAdd() {
        var qs = this.state.questions.slice();
        qs.push({
            text : "",
            answer : "",
            unit : "",
        });
        this.setState({questions : qs, editIndex : qs.length - 1});
    }

    onClickEdit(index) {
        this.setState({editIndex : index});
    }

    onClickMoveUp(index) {
        var qs = this.state.questions.slice();
        [qs[index], qs[index-1]] = [qs[index-1], qs[index]];
        this.setState({questions : qs});
    }

    onClickDelete(index) {
        var ei = this.state.editIndex;
        if(index < ei) ei--;
        var qs = this.state.questions.slice();
        qs.splice(index, 1);
        this.setState({questions : qs, editIndex : ei});
    }

    onClickSave() {
        var qs = this.state.questions.slice();
        for(var i = qs.length -1; i >= 0; i--){
            if(qs[i].text === "") {
                qs.splice(i,1);
                continue;
            }
            if (qs[i].answer === "") qs[i].answer = "0";
            else if (Number.parseFloat(qs[i].answer) < MIN_INF) qs[i].answer = MIN_INF.toString();
        }
        var name = this.state.name;
        if (name === "") name = "Uten navn";
        fetch(SERVER + "/save-quiz", {
            method: 'POST',
            body: JSON.stringify({
                user: this.props.user,
                name : name,
                file : this.props.quizFile,
                pos : 0,
                questions : qs 
                }),
            headers: { 'Content-Type': 'application/json' }
        })
        .then((res) => res.json())
        .then((data) => null);
        this.props.onQuizSaved();
    }

    render() {

        var q_rows = [];
        for(const [i, q] of this.state.questions.entries()){
            q_rows.push(
                <Question
                    key={i}
                    lang={this.props.lang}
                    id={i}
                    question={q}
                    edit={this.state.editIndex === i}
                    onClickDelete={() => this.onClickDelete(i)}
                    onClickEdit={() => this.onClickEdit(i)}
                    onClickMoveUp={() => this.onClickMoveUp(i)}
                    onQChange={(newValue, index, field) => this.onQChange(newValue, index, field)}
                    onQSubmit={(event, index) => this.onQSubmit(event, index)}
                />
            );
        }
        return (
            <div className={"wide"}>
                <div className={"m6"}>
                    <StringInput
                        type="text"
                        description={T("Name:",this.props.lang)}
                        editVal={this.state.name}
                        errorMsg={""}
                        onChange={(newValue) => this.onNameChange(newValue)}
                    />
                </div>
                <div className={""}>
                    {T("Questions:",this.props.lang)}
                </div>
                <div className={"q-list"}>
                    {q_rows}
                </div>
                <div className="row wrap">
                    <div className={""}>
                        <img
                            className="q-btn-img"
                            src={images["back"]}
                            alt={"back"}
                            onClick={() => this.props.onClickBack()}
                        />
                    </div>
                    <div className={""}>
                        <img
                            className="q-btn-img"
                            src={images["add"]}
                            alt={"add"}
                            onClick={() => this.onClickAdd()}
                        />
                    </div>
                    <div className={""}>
                        <img
                            className="q-btn-img"
                            src={images["save"]}
                            alt={"save"}
                            onClick={() => this.onClickSave()}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateQuiz;