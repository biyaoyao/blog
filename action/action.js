var http = require('http');
var md5 = require('../util/Md5');
var query=require("../util/mysql.js");  
var nodegrass = require('nodegrass');
var httpRequest = require('../util/httpRequest');
var logger = require('../util/log4js.js');
var os = require('os');
var ccap = require('ccap')();
/**
 * 登录
 */


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
    if (rand == undefined || rand.toLowerCase() != randCode.toLowerCase()) {
        tips = "验证码不正确!";
        result = false;
        write(result, tips, res);
        return;
    }
    var sql = "select tl.username,tl.password,tu.* from tb_login tl LEFT JOIN tb_userinfo as tu on tl.id=tu.id where username='" + user_name + "'";
   query(sql, function (err, rows, fields) {
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


    //创建文章分类
exports.addNewArticleTypeAction = function (req, res) {
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
   query(sql, function (err, rows, fields) {
        if (err) {
            tips = "数据库加载失败!";
            result = false;
            write(result, tips, res);
            return;
        };
        if (rows.length > 0) {
            tips = "该分类已存在";
            result = false;
            write(result, tips, res);
            return;
        } else {
            var sql1 = "INSERT INTO tb_article_type (type_name,type_desc) VALUES('" + type_name + "','" + type_desc + "')";
           query(sql1, function (err, rows, fields) {
                tips = "创建成功!";
                result = true;
                write(result, tips, res);
            });
        }
    });
}

//修改文章分类
exports.renameArticleTypeAction = function (req, res) {
    var type_name = req.query.type_name,
        type_id = req.query.type_id,
        tips = "",
        result = false,
        session = req.session;
    if (type_name == undefined || type_name.trim().length == 0) {
        tips = "分类名不能为空！";
        result = false;
        write(result, tips, res);
        return;
    }
    if (type_id == undefined || type_id.trim().length == 0) {
        tips = "未指定分类";
        result = false;
        write(result, tips, res);
        return;
    }
    var sql = "update tb_article_type set type_name='" + type_name + "' where type_id=" + type_id;
   query(sql, function (err, rows, fields) {
        tips = "修改成功!";
        result = true;
        write(result, tips, res);
    });
}

//删除文章分类
exports.adelArticleTypeAction = function (req, res) {
        var type_id = req.query.type_id,
            tips = "",
            result = false,
            session = req.session;
        if (type_id == undefined || type_id.trim().length == 0) {
            tips = "未指定分类";
            result = false;
            write(result, tips, res);
            return;
        }
        var sql = "delete from tb_article_type  where type_id=" + type_id;
       query(sql, function (err, rows, fields) {
            tips = "删除成功!";
            result = true;
            write(result, tips, res);

        });

    }



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
   query(sql, function (err, rows, fields) {
        if (err) {

            tips = "数据库加载失败!";
            result = false;
            callback(result, tips, res);

            return;

        };
        if (rows.length > 0) {
            tips = "文章标题已存在！";
            result = false;
            callback(result, tips, res);
            return;

        } else {
            var sql1 = "INSERT INTO tb_article (type_id,title,content,author,create_time) VALUES('" + type_id + "','" + title + "','" + content + "','" + author + "',now())";
           query(sql1, function (err, rows, fields) {


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
   query(sql, function (err, rows, fields) {

        tips = "发表成功!";
        result = true;

        callback(result, tips, res);


    });


}

//留言
exports.leaveMsgAction = function (req, res) {

    //   
    var user = req.query.user,
        content = req.query.content,
        tips = "",
        result = false,
        session = req.session;

    if (user == undefined || user.trim().length == 0) {
        tips = "请填写用户名！";
        result = false;
        write(result, tips, res);
        return;

    }
    if (content == undefined || content.trim().length == 0) {
        tips = "内容不能为空！";
        result = false;
        write(result, tips, res);
        return;

    }




    var sql = "INSERT into tb_leave_msg(user,content,create_time)  VALUES('" + user + "','" + content + "',now())";
   query(sql, function (err, rows, fields) {

        tips = "留言成功!";
        result = true;

        write(result, tips, res);


    });


}


/*创建相册*/

exports.addImageTypeAction = function (req, res) {

    var type_name = req.query.type_name,
        type_desc = req.query.type_desc,
        tips = "",
        result = false,
        session = req.session;
    if (type_name == undefined || type_name.trim().length == 0) {
        tips = "相册名称不能为空！";
        result = false;
        write(result, tips, res);
        return;

    }
    if (type_desc == undefined || type_desc.trim().length == 0) {
        tips = "相册描述不能为空！";
        result = false;
        write(result, tips, res);
        return;

    }


    var sql = "INSERT into tb_img_type(type_name,type_desc,create_time) VALUES('" + type_name + "','" + type_desc + "',NOW())";
   query(sql, function (err, rows, fields) {

        tips = "创建成功!";
        result = true;

        write(result, tips, res);


    });

}


/*修改相册*/


exports.editImageTypeActin = function (req, res) {

    var type_name = req.query.type_name,
        image_type_id = req.query.image_type_id,
        type_desc = req.query.type_desc,
        tips = "",
        result = false,
        session = req.session;
    if (image_type_id == undefined || image_type_id.trim().length == 0) {
        tips = "请指定要修改的相册";
        result = false;
        write(result, tips, res);
        return;

    }
    if (type_name == undefined || type_name.trim().length == 0) {
        tips = "相册名称不能为空！";
        result = false;
        write(result, tips, res);
        return;

    }
    if (type_desc == undefined || type_desc.trim().length == 0) {
        tips = "相册描述不能为空！";
        result = false;
        write(result, tips, res);
        return;

    }


    var sql = "UPDATE tb_img_type set type_name='" + type_name + "' ,type_desc='" + type_desc + "',create_time=NOW() where image_type_id=" + image_type_id;
   query(sql, function (err, rows, fields) {

        tips = "修改成功!";
        result = true;

        write(result, tips, res);


    });

}

/*删除相册*/


exports.deleteImageTypeActin = function (req, res) {

    var image_type_id = req.query.image_type_id,
        tips = "",
        result = false,
        session = req.session;
    if (image_type_id == undefined || image_type_id.trim().length == 0) {
        tips = "请指定要删除的相册";
        result = false;
        write(result, tips, res);
        return;

    }

    var sql = "delete img,type from tb_img_type type LEFT JOIN tb_img as img on img.image_type_id=type.image_type_id where type.image_type_id=" + image_type_id;
   query(sql, function (err, rows, fields) {

        tips = "删除成功!";
        result = true;

        write(result, tips, res);


    });

}

/*修改相片*/


exports.editImageActin = function (req, res) {

    var img_id = req.query.img_id,
        img_desc = req.query.img_desc,
        tips = "",
        result = false,
        session = req.session;
    if (img_id == undefined || img_id.trim().length == 0) {
        tips = "请指定要修改的相片";
        result = false;
        write(result, tips, res);
        return;

    }

    if (img_desc == undefined || img_desc.trim().length == 0) {
        tips = "相片描述不能为空！";
        result = false;
        write(result, tips, res);
        return;

    }


    var sql = "UPDATE tb_img set img_desc='" + img_desc + "',create_time=NOW() where img_id=" + img_id;
   query(sql, function (err, rows, fields) {

        tips = "修改成功!";
        result = true;

        write(result, tips, res);


    });

}

/*删除相册*/


exports.deleteImageActin = function (req, res) {

    var img_id = req.query.img_id,
        tips = "",
        result = false,
        session = req.session;
    if (img_id == undefined || img_id.trim().length == 0) {
        tips = "请指定要删除的相片！";
        result = false;
        write(result, tips, res);
        return;

    }

    var sql = "delete  from  tb_img  where img_id=" + img_id;
   query(sql, function (err, rows, fields) {

        tips = "删除成功!";
        result = true;

        write(result, tips, res);


    });

}



//

exports.sumbitImgAction = function (req, res) {

        var img_desc = req.query.img_desc,
            image_type_id = req.query.image_type_id,
            img_url = req.query.img_url,
            tips = "",
            result = false,
            session = req.session;
        if (image_type_id == undefined || image_type_id.trim().length == 0) {
            tips = "请指定要上传的相册";
            result = false;
            write(result, tips, res);
            return;

        }
        if (img_desc == undefined || img_desc.trim().length == 0) {
            tips = "相片描述不能为空！";
            result = false;
            write(result, tips, res);
            return;

        }
        if (img_url == undefined || img_url.trim().length == 0) {
            tips = "相片路径不能为空！";
            result = false;
            write(result, tips, res);
            return;

        }


        var value = "";
        var url_list = img_url.split(",");
        var desc_list = img_desc.split(",");

        for (var i = 0; i < url_list.length; i++) {

            if (url_list[i] != undefined && url_list[i] != "") {
                value = value + "(" + image_type_id + ", '" + desc_list[i] + "', '" + url_list[i] + "', NOW()),";
            }
        }

        if (value == "") {
            tips = "参数出错!";
            result = false;
            write(result, tips, res);

        } else {

            value = value.substring(0, value.length - 1);
            var sql = "INSERT into tb_img(image_type_id,img_desc,img_url,create_time) VALUES " + value;



           query(sql, function (err, rows, fields) {

                tips = "上传成功!";
                result = true;

                write(result, tips, res);


            });

        }

    }




    /**
     * 验证码生成
     */
exports.randCode = function (req, res) {

    if (req.url == '/favicon.ico') return res.end(''); //Intercept request favicon.ico

    var ary = ccap.get();

    var txt = ary[0];

    var buf = ary[1];
    req.session.code = txt;
    var ip = httpRequest.getClientIp(req).replace('::ffff:', '');
    logger.debug("code:" + txt);
    logger.debug("ip:" + ip);
    res.end(buf);



};
/**
 * 
 * 
 * @param {[[Type]]} result [[Description]]
 * @param {[[Type]]} tips   [[Description]]
 * @param {[[Type]]} res    [[Description]]
 */

exports.visitAction = function (req, res) {
    var tips = "",
        result = false,
        type = req.query.type,
        article_id=req.query.article_id,
        ip = httpRequest.getClientIp(req).replace('::ffff:', '');
    nodegrass.get("http://ip.taobao.com//service/getIpInfo.php?ip=" + ip, function (data, status, headers) {
        var data = eval('(' + data + ')');
        if (type == undefined) {
            tips = "var jsonp='参数出错'";
            result = false;
            writeJsonp(result, tips, res);
            return;
        }
        if (data.code != 0) {
            tips = "var jsonp='参数出错'";
            result = false;
            writeJsonp(result, tips, res);
            return;
        }
        var sql = "";
        if (type == 0) {
            sql = "INSERT into tb_visit(ip,country,area,province,city,ip_type,visit_time) VALUE('" + ip + "','" + unescape(data.data.country) + "','" + unescape(data.data.area) + "','" + unescape(data.data.region) + "','" + unescape(data.data.city) + "','" + unescape(data.data.isp) + "',NOW())";
        } else if (type == 1&&article_id!=undefined) {
            sql = "INSERT INTO tb_article_scan(article_id,ip,country,area,province,city,ip_type,scan_time) VALUES (" + article_id + ",'" + ip + "','" + unescape(data.data.country) + "','" + unescape(data.data.area) + "','" + unescape(data.data.region) + "','" + unescape(data.data.city) + "','" + unescape(data.data.isp) + "',NOW())";

        } else {

            tips = "var jsonp='参数出错！'";
            result = false;
            writeJsonp(result, tips, res);
            return;

        }
      logger.debug('sql:'+sql);
       query(sql, function (err, rows, fields) {
            tips = "var jsonp='少年你终于发现了！'";
            
            result = true;
            writeJsonp(result, tips, res);
        });

    }, 'gbk').on('error', function (e) {
        tips = "var jsonp='网络慢'";
        result = false;
        writeJsonp(result, tips, res);
    });




};

function write(result, tips, res) {
    var json = new Object();
    json.result = result;
    json.tips = tips;
    res.end("" + JSON.stringify(json));



}
function writeJsonp(result, tips, res) {
    var json = new Object();
    json.result = result;
    json.tips = tips;
    res.writeHead(200, {"Content-Type": "text/html;charset:utf-8"});
    res.end("" + json.tips);



}

function callback(result, tips, res) {
    res.end("<script>parent.callback('" + tips + "'," + result + ")</script>");

}