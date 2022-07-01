
exports.create = function(name, conn) {
    var p = {
        name : name,
        conn : conn,
        cash : 2
    }
    return p;
}
