var express = require('express');
var app = express();
app.get('/flicktionary.html', function(req, res){
 res.send("this is route 2");
});
app.listen(8080);
