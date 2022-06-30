import React from "react";

class StringInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.props.onChange(e.target.value);
    }
    handleSubmit(e) {
        this.props.onSubmit(e);
    }
    renderOk(){
        if(!this.props.withOk) return null;
        return (<input type="submit" value="OK" />);
    }

    render() {
        return (
            <div className="string-inn-box">
                <div>
                    {this.props.description}
                </div>
                <div style={{ color: "purple" }}>
                    {this.props.errorMsg}
                </div>
                <form onSubmit={this.handleSubmit} className="s-inn">
                    <input type="text" value={this.props.editVal} onChange={this.handleChange}  className="s-inn"/>
                    {this.renderOk()}
                </form>
            </div>
        );
    }
}

export default StringInput;