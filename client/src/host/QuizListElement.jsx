import React from "react";
import {images} from "./../helper/Consts";
import './../styles/EditQuiz.css';

class QuizListElement extends React.Component {

    render() {
        return (
            <div className={"q-info-holder"}>
                <div className={"q-info"}>
                    <div className={"q-text"}>
                        Name: {this.props.name}
                    </div>
                    <div className={"q-ans"}>
                        Length: {this.props.length}
                    </div>
                </div>
                <div className="list-btn-holder">
                    <img
                        className="q-btn-img"
                        src={images["q-edit"]}
                        alt={"edit"}
                        onClick={this.props.onClickEdit}
                    />
                    <img
                        className="q-btn-img"
                        src={images["q-del"]}
                        alt={"delete"}
                        onClick={this.props.onClickDelete}
                    />
                    <img
                        className="q-btn-img"
                        src={images["q-play"]}
                        alt={"play"}
                        onClick={this.props.onClickPlay}
                    />
                </div>
            </div>
        )
    }
}

export default QuizListElement;