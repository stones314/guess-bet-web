import React from "react";
import {images} from "./../helper/Consts";
import './../styles/EditQuiz.css';
import {T} from "../helper/Translate";

class QuizListElement extends React.Component {

    render() {
        return (
            <div className={"row brdr"}>
                <div className={"row f3 center"}>
                    <div className={"f3"}>
                        {this.props.name}
                    </div>
                    <div className={"f2"}>
                        {""+this.props.length+T(" q",this.props.lang)}
                    </div>
                    <div className={"f1"}>
                        <img
                            className="flag-img"
                            src={images[this.props.lang]}
                            alt={this.props.lang}
                        />
                    </div>
                </div>
                <div className="row wrap f1">
                    <img
                        className="q-btn-img"
                        src={images["play"]}
                        alt={"play"}
                        onClick={this.props.onClickPlay}
                    />
                    <img
                        className="q-btn-img"
                        src={images["edit"]}
                        alt={"edit"}
                        onClick={this.props.onClickEdit}
                    />
                    <img
                        className="q-btn-img"
                        src={images["del"]}
                        alt={"delete"}
                        onClick={this.props.onClickDelete}
                    />
                </div>
            </div>
        )
    }
}

export default QuizListElement;