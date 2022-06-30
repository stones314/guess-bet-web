import React from "react";
import {images} from "./../helper/Consts";
import './../styles/EditQuiz.css';

class QuestionInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeQ = this.handleChangeQ.bind(this);
        this.handleChangeA = this.handleChangeA.bind(this);
        this.handleChangeU = this.handleChangeU.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeQ(e) {
        this.props.onStringChange(e.target.value, this.props.id, "text");
    }
    handleChangeA(e) {
        this.props.onStringChange(e.target.value, this.props.id, "answer");
    }
    handleChangeU(e) {
        this.props.onStringChange(e.target.value, this.props.id, "unit");
    }
    handleSubmit(e) {
        this.props.onSubmit(e, this.props.id);
    }
    renderOk(doIt){
        if(!doIt)return null;
        return (
            <div className={"q-edit"}>
                <input type="submit" value="OK" />
            </div>
        );
    }
    render() {
        return (
            <div className={"q-holder"}>
                <div style={{ color: "purple" }}>
                    {this.props.errorMsg}
                </div>
                <form onSubmit={this.handleSubmit} className="q-inn-f">
                    <div className={"q-question"}>
                        Q:<textarea value={this.props.Q.text} onChange={this.handleChangeQ} className="q-inn-q"/>
                    </div>
                    <div className={"q-ans"}>
                        A:<input type="text" value={this.props.Q.answer} onChange={this.handleChangeA}  className="q-inn-a"/>
                        Unit:<input type="text" value={this.props.Q.unit} onChange={this.handleChangeU}  className="q-inn-u"/>
                    </div>
                    {this.renderOk(true)}
                </form>
            </div>
        );
    }
}

class Question extends React.Component {

    renderEdit() {
        return (
            <div>
                <QuestionInput
                    id={this.props.id}
                    onSubmit={(event, index) => this.props.onQSubmit(event, index)}
                    onStringChange={(value, index, field) => this.props.onQChange(value, index, field)}
                    Q={this.props.question}
                    errorMsg={""}
                />
            </div>
        )
    }
    
    renderShort() {
        return (
            <div className={"q-holder"}>
                <div className="q-input">
                <div className={"q-question"}>
                    Q: {this.props.question.text}
                </div>
                <div className={"q-ans"}>
                    <div className={"q-text"}>
                        A: {this.props.question.answer}
                    </div>
                    <div className={"q-text"}>
                        ({this.props.question.unit})
                    </div>
                </div>
                </div>
                <div className={"q-edit"}>
                    <div>
                        <img
                            className="q-btn-img"
                            src={images["q-edit"]}
                            alt={"edit"}
                            onClick={this.props.onClickEdit}
                        />
                    </div>
                    <div>
                        <img
                            className="q-btn-img"
                            src={images["q-del"]}
                            alt={"delete"}
                            onClick={this.props.onClickDelete}
                        />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if(this.props.edit)
        {
            return (
                <div>
                    {this.renderEdit()}
                </div>
            )
        }
        else
        {
            return (
                <div>
                    {this.renderShort()}
                </div>
            )
        }
    }
}

export default Question;