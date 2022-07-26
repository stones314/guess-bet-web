const consts = require("./consts");

exports.create = function(name, pwd) {
    var u = {
        name : name,
        pwd : pwd,
        lastLogin : Date(),
        quizes : []
    }
    return u;
}