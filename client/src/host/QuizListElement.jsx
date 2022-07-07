import React from "react";
import {images} from "./../helper/Consts";
import './../styles/EditQuiz.css';

class QuizListElement extends React.Component {

    render() {
        return (
            <div className={"row brdr"}>
                <div className={"row f3 center"}>
                    <div className={"f1"}>
                        {this.props.name}
                    </div>
                    <div className={"f1"}>
                        {""+this.props.length+" spm"}
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