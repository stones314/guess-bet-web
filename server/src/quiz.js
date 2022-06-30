
class Quiz {
    constructor(name) {
        this.name = name;
        this.questions = [];
    }

    AddQuestion(text, answer, unit, scale) {
        this.questions.push({
            "Text" : text,
            "Answer" : answer,
            "Unit" : unit,
            "Scale" : scale
        });
    }
}

export default Quiz;