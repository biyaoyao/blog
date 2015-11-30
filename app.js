/**
 * Module dependencies.
 */

var express = require('express');
var view = require('./view/view');
var action = require('./action/action');
var http = require('http');
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');

var app = express();

// all environments
app.set('port', process.env.PORT || 8090);
app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser('sctalk admin manager'));

app.use(session({
    secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
    cookie: {
        maxAge: 60 * 1000 * 1200
    }
}));



/*app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));*/
/**
 * 
 -------------------------------------------------------项目部署-----------------------------------------------------srart
 */
//主页

app.get('/', view.index);

app.get('/home', view.index);
//博客
app.get('/blog', view.blog);
//相册
app.get('/albumList', view.albumList);
//相册
app.get('/albumDetail', view.albumDetail);
//个人档案
app.get('/profile', view.profile);
//留言板
app.get('/msgBoard', view.msgBoard);
//管理中心
app.get('/manager', view.manager);
//登录
app.get('/login', view.login);
//文章详情
app.get('/articleDetail', view.articleDetail);
//发表文章
app.get('/newArticle', view.newArticle);
//修改文章类型
app.get('/articleTypeEdit', view.articleTypeEdit);
//图片上传
app.get('/imgUpload', view.imgUpload);


/**
 * 
 ----------------------------------------------------------项目部署----结束----------------------------------------------end
 */







/**
 * 
 -------------------------------------------------------项目api接口--后缀统一加上.action---------------------------------------------------srart
 */
//登录接口
app.get('/login.action', action.loginAction);
//登出
app.get('/logout.action', action.logoutAction);

//创建文章类型
app.get('/addNewArticleType.action', action.addNewArticleTypeAction);
app.get('/renameArticleType.action', action.renameArticleTypeAction);
app.get('/delArticleType.action', action.adelArticleTypeAction);
//创建文章
app.post('/createNewArticle.action', action.createNewArticleAction);
//发表评论
app.post('/commentArticle.action', action.commentArticleAction);
//创建相册
app.get('/addImageType.action', action.addImageTypeAction);
//修改相册
app.get('/editImageType.action', action.editImageTypeActin);
//删除相册
app.get('/deleteImageType.action', action.deleteImageTypeActin);
//图片上传
app.get('/sumbitImg.action', action.sumbitImgAction);
//修改相片
app.get('/editImage.action', action.editImageActin);
//删除相片
app.get('/deleteImage.action', action.deleteImageActin);
//留言
app.get('/leaveMsg.action', action.leaveMsgAction);
//
//验证码生成页面
app.get('/randCode', action.randCode);




/**
 * 
 -------------------------------------------------------项目api接口-----------------------------------------------------end
 */

http.createServer(app).listen(app.get('port'), function () {
   
    //console.log('Express server listening on port ' + app.get('port'));
});