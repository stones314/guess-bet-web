
exports.create = function(name) {
    var quiz = {
        name : name,
        pos : -1,
        questions : [],
    }
    return quiz;
}

exports.addQuestion = function(quiz, text, answer, unit) {
    quiz.questions.push({
        text : text,
        answer : answer,
        unit : unit
    });
}