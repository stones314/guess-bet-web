import React from "react";
import {images} from "./../helper/Consts";
import './../styles/EditQuiz.css';
import { T } from "../helper/Translate";

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
            <div className={""}>
                <input type="submit" value="OK" />
            </div>
        );
    }
    render() {
        return (
            <div className="col brdr">
                <div style={{ color: "purple" }}>
                    {this.props.errorMsg}
                </div>
                <form onSubmit={this.handleSubmit} className="q-inn-f">
                    {T("Question:",this.props.lang)}
                    <div className={"q-question"}>
                        <textarea value={this.props.Q.text} onChange={this.handleChangeQ} className=""/>
                    </div>
                    {T("Answer:",this.props.lang)}
                    <div className={"txt-left"}>
                        <input type="number" value={this.props.Q.answer} onChange={this.handleChangeA}  className=""/>
                    </div>
                    {T("Unit:",this.props.lang)}
                    <div className={"txt-left"}>
                        <input type="text" value={this.props.Q.unit} onChange={this.handleChangeU}  className=""/>
                    </div>
                    {this.renderOk(true)}
                </form>
            </div>
        );
    }
}

function Question(props) {

    function renderEdit() {
        return (
            <div>
                <QuestionInput
                    id={props.id}
                    lang={props.lang}
                    onSubmit={(event, index) => props.onQSubmit(event, index)}
                    onStringChange={(value, index, field) => props.onQChange(value, index, field)}
                    Q={props.question}
                    errorMsg={""}
                />
            </div>
        )
    }

    
    function renderShort() {
        const fade = props.id === 0 ? " fade" : "";
        return (
            <div className="row brdr">
                <div className="col">
                    <div className="txt-left">
                        {props.question.text}
                    </div>
                    <div className="row m3">
                        <div>
                            {props.question.answer}
                        </div>
                        <div>
                            ({props.question.unit})
                        </div>
                    </div>
                </div>
                <div className="row items-right">
                    <div>
                        <img
                            className="q-btn-img"
                            src={images["edit"]}
                            alt="edit"
                            onClick={props.onClickEdit}
                        />
                    </div>
                    <div>
                        <img
                            className="q-btn-img"
                            src={images["del"]}
                            alt="delete"
                            onClick={props.onClickDelete}
                        />
                    </div>
                    <div>
                        <img
                            className={"q-btn-img"+fade}
                            src={images["moveup"]}
                            alt="moveup"
                            onClick={() => {
                                if(fade === "")props.onClickMoveUp()
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    if(props.edit)
    {
        return (renderEdit())
    }
    else
    {
        return (renderShort())
    }
}

export default Question;