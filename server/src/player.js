
exports.create = function(name, conn) {
    var p = {
        name : name,
        conn : conn,
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
        ]
    }
    return p;
}
