var express = require('express');
var path = require('path');
var server = express();

server.listen('3000',function(){
    console.log('server is listening in port 3000!');
})