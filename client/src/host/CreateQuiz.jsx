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
                console.log(data.quiz);
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
        .then((data) => console.log(data));
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
                    onQChange={(newValue, index, field) => this.onQChange(newValue, index, field)}
                    onQSubmit={(event, index) => this.onQSubmit(event, index)}
                />
            );
        }
        return (
            <div className={"narrow"}>
                <div className={"cq-name"}>
                    <StringInput
                        type="text"
                        description={"Quiz Name: "}
                        editVal={this.state.name}
                        errorMsg={""}
                        onChange={(newValue) => this.onNameChange(newValue)}
                    />
                </div>
                <div className={"header-text"}>
                    Questions
                </div>
                <div className={"q-list"}>
                    {q_rows}
                </div>
                <div className={"q-add"}>
                    <img
                        className="q-btn-img"
                        src={images["q-add"]}
                        alt={"add"}
                        onClick={() => this.onClickAdd()}
                    />
                </div>
                <div className={"q-save"}>
                    <img
                        className="q-save-img"
                        src={images["q-save"]}
                        alt={"save"}
                        onClick={() => this.onClickSave()}
                    />
                    Save
                </div>
            </div>
        )
    }
}

export default CreateQuiz;