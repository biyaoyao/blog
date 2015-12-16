var http = require('http');
var md5 = require('../util/Md5');
var nodegrass = require('nodegrass');
var httpRequest = require('../util/httpRequest');
var mysql = require('mysql');
var log4js=require('log4js');
var connection = mysql.createConnection({
    host: '203.195.150.220',
    user: 'syjk',
    password: 'syjk2015',
    database: 'db_blue',
    port: 3306
});
var os = require('os');
var ccap = require('ccap')();
/**
 * 登录
 */

var date=new Date();
log4js.configure({
  appenders: [
    { type: 'console' },{
      type: 'file', 
      filename: 'public/logs/'+date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+'.log', 
      maxLogSize: 1024,
      backups:4,
      category: 'normal' 
    }
  ],
  replaceConsole: true
});

var logger = log4js.getLogger('normal');
   
exports.loginAction = function (req, res) {
    var user_name = req.query.user_name,
        password = req.query.password,
        rand = req.query.rand,
        tips = "";
    var session = req.session;
    var result = false;

    if (user_name == undefined || user_name.trim().length == 0) {
        tips = "用户名为空！";
        result = false;
        write(result, tips, res);
        return;

    }
    if (password == undefined || password.trim().length == 0) {
        tips = "密码不能为空";
        result = false;
        write(result, tips, res);
        return;

    } else {
        password = md5.hex_md5(password);

    }
    if (rand == undefined || rand.trim().length == 0) {
        tips = "验证码不能为空!";
        result = false;
        write(result, tips, res);
        return;
    }


    var randCode = session.code + "";
    // var ss = md5.hex_md5("11111");

    /*rand=MD5.code(rand.toLocaleLowerCase());*/

    console.log("randCode:" + randCode.toLowerCase() + "\nrand:" + rand.toLowerCase());
    if (rand == undefined || rand.toLowerCase() != randCode.toLowerCase()) {
        tips = "验证码不正确!";
        result = false;
        write(result, tips, res);
        return;
    }
    var sql = "select tl.username,tl.password,tu.* from tb_login tl LEFT JOIN tb_userinfo as tu on tl.id=tu.id where username='" + user_name + "'";
    connection.query(sql, function (err, rows, fields) {
        if (err) {

            tips = "数据库加载失败!";
            result = false;
            write(result, tips, res);
            return;

        };
        if (rows.length == 0) {
            tips = "没有该账号！";
            result = false;
            write(result, tips, res);
            return;

        } else {

            if (password == rows[0].password) {
                tips = "登陆成功！";
                result = true;
                session.id = rows[0].id;
                session.username = rows[0].username;
                session.real_name = rows[0].real_name;
                session.sex = rows[0].sex;
                session.email = rows[0].email;
                session.birth_place = rows[0].birth_place;
                session.live_place = rows[0].live_place;
                session.introduce = rows[0].introduce;
                write(result, tips, res);


            } else {

                tips = "密码不正确！";
                result = false;
                write(result, tips, res);
                return;

            }
        }


    });

};
//登出接口
exports.logoutAction = function (req, res) {
        req.session.destroy();
        var tips = "注销成功！";
        var result = true;
        write(result, tips, res);
    }
    //主页
exports.homeAction = function (req, res) {
 logger.debug('homeAction' );
        var ip = httpRequest.getClientIp(req).replace('::ffff:', '');

        nodegrass.get("http://ip.taobao.com//service/getIpInfo.php?ip=" + ip, function (data, status, headers) {
            var sql = "";
            data = eval('(' + data + ')');
            var sql = "INSERT into tb_visit(ip,country,area,province,city,ip_type,visit_time) VALUE('" + ip + "','" + unescape(data.data.country) + "','" + unescape(data.data.area) + "','" + unescape(data.data.region) + "','" + unescape(data.data.city) + "','" + unescape(data.data.isp) + "',NOW())";

            connection.query(sql, function (err, rows, fields) {
  


        }, 'gbk').on('error', function (e) {

            console.log("sql:" + e);
        });


    }
    //博客
exports.blogAction = function (req, res) {
     logger.debug('blog' );
    var type_id = req.query.type_id;
    if (type_id != undefined) {

        type_id = "where ta.type_id=" + type_id;
    } else {

        type_id = "";
    }

    var article_sql = "select ta.*,tat.type_name,count(DISTINCT tac.comment_id) as comment_count,count(DISTINCT tas.scan_id) as scan_count from tb_article ta LEFT JOIN tb_articel_comment as tac on tac.article_id=ta.article_id LEFT JOIN tb_article_scan as tas  on tas.article_id=ta.article_id LEFT JOIN tb_article_type as tat  on tat.type_id=ta.type_id  " + type_id + "   GROUP  BY ta.article_id  ORDER BY  tat.type_id,  ta.create_time DESC ";


    console.log(article_sql);
    connection.query(article_sql, function (err, rows, fields) {
        var articleList = rows;



        var type_sql = "select article_type.* ,count(DISTINCT article.article_id) as article_count from tb_article_type article_type LEFT JOIN tb_article as article on article.type_id=article_type.type_id GROUP BY article_type.type_id";

        connection.query(type_sql, function (err, rows, fields) {
            var type_list = rows;
            var comment_sql = "SELECT * from tb_articel_comment ORDER BY comment_time desc limit 4";
            connection.query(comment_sql, function (err, rows, fields) {
               var comment_list=rows;

                res.render('blog', {
                    session: req.session.username == null ? "null" : req.session,
                    title: "",
                    article_list: articleList,
                    type_list: type_list,
                    comment_list:comment_list
                });

            });
        });

    });



}

//创建文章分类
exports.addNewArticleTypeAction = function (req, res) {

    //   
    var type_name = req.query.type_name,
        type_desc = req.query.type_desc,
        tips = "",
        result = false,
        session = req.session;


    if (type_name == undefined || type_name.trim().length == 0) {
        tips = "分类名不能为空！";
        result = false;
        write(result, tips, res);
        return;

    }
    if (type_desc == undefined || type_desc.trim().length == 0) {
        tips = "分类描述不能为空";
        result = false;
        write(result, tips, res);
        return;

    }


    var sql = "select * from tb_article_type where type_name='" + type_name + "'";
    connection.query(sql, function (err, rows, fields) {
        if (err) {

            tips = "数据库加载失败!";
            result = false;
            write(result, tips, res);
            console.log(err);
            return;

        };
        if (rows.length > 0) {
            tips = "该分类已存在";
            result = false;
            write(result, tips, res);
            return;

        } else {
            var sql1 = "INSERT INTO tb_article_type (type_name,type_desc) VALUES('" + type_name + "','" + type_desc + "')";
            connection.query(sql1, function (err, rows, fields) {

                console.log(sql1 + "rows:" + fields);
                tips = "创建成功!";
                result = true;
                write(result, tips, res);


            });

        }

    });






}


//获取文章类型
exports.articleTypeAction = function (req, res) {



        var sql = "select * from tb_article_type";

        connection.query(sql, function (err, rows, fields) {


            res.render('newArticle', {
                session: req.session.username == null ? "null" : req.session,
                title: "",
                typeList: rows
            });

        });



        //



    }
    //获取文章详情
exports.articleDetailAction = function (req, res) {
 logger.debug('articleDetailAction' );
        var article_id = req.query.article_id;
        var type = req.query.type;

        var sql = "select ta.*,tat.type_name,count(DISTINCT tac.comment_id) as comment_count,count(DISTINCT tas.scan_id) as scan_count from tb_article ta LEFT JOIN tb_articel_comment as tac on tac.article_id=ta.article_id LEFT JOIN tb_article_scan as tas  on tas.article_id=ta.article_id LEFT JOIN tb_article_type as tat  on tat.type_id=ta.type_id where ta.article_id=" + article_id;
        var comment_sql = "SELECT * from tb_articel_comment where article_id=" + article_id + " ORDER BY comment_time desc";
        connection.query(sql, function (err, rows, fields) {
            var article = rows[0];

            //res.render('articleDetail', { session: req.session,title:"",article:article });

            connection.query(comment_sql, function (err, rows, fields) {
                var comment_list = rows;

                var ip = httpRequest.getClientIp(req).replace('::ffff:', '');
                if (type == undefined) {
                    nodegrass.get("http://ip.taobao.com//service/getIpInfo.php?ip=" + ip, function (data, status, headers) {
                        var data = eval('(' + data + ')');
                        var scan_sql = "INSERT INTO tb_article_scan(article_id,ip,country,area,province,city,ip_type,scan_time) VALUES (" + article_id + ",'" + ip + "','" + unescape(data.data.country) + "','" + unescape(data.data.area) + "','" + unescape(data.data.region) + "','" + unescape(data.data.city) + "','" + unescape(data.data.isp) + "',NOW())";
                        connection.query(scan_sql, function (err, rows, fields) {




                        });
                    }, 'gbk').on('error', function (e) {


                    });

                }

                console.log("type:" + type);
                res.render('articleDetail', {
                    session: req.session,
                    title: "",
                    article: article,
                    comment_list: comment_list
                });

            });

        });



        //



    }
    //


//创建新文章
exports.createNewArticleAction = function (req, res) {

    //   
    var type_id = req.body.type_id,
        title = req.body.title,
        content = req.body.content,
        author = req.body.author,
        tips = "",
        result = false,
        session = req.session;

    if (type_id == undefined || type_id.trim().length == 0) {
        tips = "请传入文章分类！";
        result = false;
        callback(result, tips, res);
        return;

    }
    if (title == undefined || title.trim().length == 0) {
        tips = "标题不嫩为空！";
        result = false;
        callback(result, tips, res);
        return;

    }
    if (content == undefined || content.trim().length == 0) {
        tips = "文章内容不能为空！";
        result = false;
        callback(result, tips, res);
        return;

    }


    var sql = "select * from tb_article where title='" + title + "'";
    connection.query(sql, function (err, rows, fields) {
        if (err) {

            tips = "数据库加载失败!";
            result = false;
            callback(result, tips, res);
            console.log(err);
            return;

        };
        if (rows.length > 0) {
            tips = "文章标题已存在！";
            result = false;
            callback(result, tips, res);
            return;

        } else {
            var sql1 = "INSERT INTO tb_article (type_id,title,content,author,create_time) VALUES('" + type_id + "','" + title + "','" + content + "','" + author + "',now())";
            connection.query(sql1, function (err, rows, fields) {


                tips = "创建成功!";
                result = true;

                callback(result, tips, res);


            });

        }

    });






}



//


//发表评论
exports.commentArticleAction = function (req, res) {

        //   
        var article_id = req.body.article_id,
            user = req.body.user,
            comment = req.body.comment,
            code = req.body.code,
            tips = "",
            result = false,
            session = req.session;

        if (article_id == undefined || article_id.trim().length == 0) {
            tips = "未指定文章！";
            result = false;
            callback(result, tips, res);
            return;

        }
        if (user == undefined || user.trim().length == 0) {
            tips = "请填写用户名！";
            result = false;
            callback(result, tips, res);
            return;

        }
        if (comment == undefined || comment.trim().length == 0) {
            tips = "评论内容不能为空！";
            result = false;
            callback(result, tips, res);
            return;

        }
        if (code == undefined || code.trim().length == 0) {
            tips = "验证码不能为空!";
            result = false;
            callback(result, tips, res);
            return;
        }


        var randCode = session.code + "";
        // var ss = md5.hex_md5("11111");

        /*rand=MD5.code(rand.toLocaleLowerCase());*/


        if (code == undefined || code.toLowerCase() != randCode.toLowerCase()) {
            tips = "验证码不正确!";
            result = false;
            callback(result, tips, res);
            return;
        }


        var sql = "INSERT into tb_articel_comment(article_id,user,comment,comment_time)  VALUES('" + article_id + "','" + user + "','" + comment + "',now())";
        connection.query(sql, function (err, rows, fields) {

            tips = "发表成功!";
            result = true;

            callback(result, tips, res);


        });


    }
    //

/**
 * 验证码生成
 */
exports.randCode = function (req, res) {

    if (req.url == '/favicon.ico') return res.end(''); //Intercept request favicon.ico

    var ary = ccap.get();

    var txt = ary[0];

    var buf = ary[1];
    req.session.code = txt;
    res.end(buf);

    console.log(txt);

};


function write(result, tips, res) {
    var json = new Object();
    json.result = result;
    json.tips = tips;
    res.end("" + JSON.stringify(json));



}

function callback(result, tips, res) {
    res.end("<script>parent.callback('" + tips + "'," + result + ")</script>");

}