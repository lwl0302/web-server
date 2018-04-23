// 引入第三方中间件
var express = require('express');
var ejs = require('ejs');
var proxy = require('http-proxy-middleware');

// node内置模块
var path = require('path');
var http = require('http');

var app = express();

// 调用express.static中间件，指定静态资源目录
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

//定义一个模板引擎
app.engine('html',ejs.__express);

//设置引擎的模板初始路径
//设置html模板的路径为views，下面代码在使用引擎返回页面时，只需写相对views的路径即可
app.set('views',path.join(__dirname,'views'));

//设置对应模板引擎
app.set('views engine','html');

//3、get方式提交时，渲染页面
app.get('/',function(req,res){
    //使用res.render方式发送页面
    res.render('index.html');
    //在这里不需要再写html相对当前文件的路径，而是直接通过views目录来找到index.html文件
});

//express-http-middleware分发接口到指定服务器endpointChat
var config = require('./config.js');

app.use('/', proxy({target : config.url, ws : true , limit : '1gb'}));

http.createServer(app).listen(8080,function () {
    console.log("服务器启动成功！！！！port:8080");
});

module.exports = app;