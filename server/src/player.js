
exports.create = function(name, conn, color) {
    var p = {
        name : name,
        conn : conn,
        color: color,
        cash : 2,
        ans : -12345678,//this value is used for Not Provided
        bet : [
            {
                opt : 0,
                val : 0
            },
            {
                opt : 0,
                val : 0
            }
        ],
        won : 0
    }
    return p;
}
