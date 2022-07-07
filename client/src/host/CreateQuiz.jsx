import React from "react";
import Question from "./Question";
import {images, SERVER, GameState} from "./../helper/Consts";
import './../styles/EditQuiz.css';
import StringInput from "../helper/StringInput";


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
                body: JSON.stringify({ file : this.props.quizFile }),
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
        fetch(SERVER + "/save-quiz", {
            method: 'POST',
            body: JSON.stringify({
                name : this.state.name,
                file : this.props.quizFile, //TODO: use qid the same way as gid to identify a quiz (except it is not shown to user)
                pos : 0,
                questions : this.state.questions 
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
                        description={"Navn:"}
                        editVal={this.state.name}
                        errorMsg={""}
                        onChange={(newValue) => this.onNameChange(newValue)}
                    />
                </div>
                <div className={""}>
                    Spørsmål:
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