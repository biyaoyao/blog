var query = require("../util/mysql.js");
var nodegrass = require('nodegrass');
var httpRequest = require('../util/httpRequest');
var logger = require('../util/log4js.js');
var cache = require('memory-cache');

// now just use the cache


/**
 * 
 ----------------------------------------------------------页面----开始----------------------------------------------end
 */

/*
主页
*/

exports.index = function (req, res) {
    var index = cache.get('index');

   logger.debug("index:" + index);

    if (index != null&&index.session==(req.session.username == undefined ? "null" : req.session)) {
        index.visit_count++;
        res.render('index', index);

        return;


    }

    var ip = httpRequest.getClientIp(req).replace('::ffff:', '');
    query("select COUNT(*) as visit_count from tb_visit", function (err, rows, fields) {
        var visit_count = rows == null ? new Object() : rows[0].visit_count;
        var articleList = "select ta.*,tat.type_name,count(DISTINCT tac.comment_id) as comment_count,count(DISTINCT tas.scan_id) as scan_count from tb_article ta LEFT JOIN tb_articel_comment as tac on tac.article_id=ta.article_id LEFT JOIN tb_article_scan as tas  on tas.article_id=ta.article_id LEFT JOIN tb_article_type as tat  on tat.type_id=ta.type_id    GROUP  BY ta.article_id  ORDER BY  tat.type_id,  ta.create_time DESC";
        query("select * from tb_userinfo", function (err, rows, fields) {

            var userinfo = rows == null ? new Object() : rows[0];
            query(articleList, function (err, rows, fields) {
                var typeList = new Array();
                var type_id = -1;
                for (var i = 0; i < rows.length; i++) {

                    if (type_id != rows[i].type_id) {
                        type_id = rows[i].type_id;
                        var type = new Object();
                        type.type_id = type_id;
                        type.type_name = rows[i].type_name;
                        type.type_desc = rows[i].type_desc;
                        typeList.push(type);
                    }

                }
                var type = new Object();
                for (var j = 0; j < typeList.length; j++) {
                    var articleList = new Array();
                    for (var i = 0; rows != null && i < rows.length; i++) {

                        if (typeList[j].type_id == rows[i].type_id) {
                            var article = new Object();
                            article.article_id = rows[i].article_id;
                            article.article_id = rows[i].article_id;
                            article.title = rows[i].title;
                            article.content = rows[i].content;
                            article.author = rows[i].author;
                            article.create_time = rows[i].create_time;
                            article.scan_count = rows[i].scan_count;
                            article.comment_count = rows[i].comment_count;
                            articleList.push(article);

                        }
                    }
                    typeList[j].articleList = articleList;
                }

                cache.put('index', {
                    session: req.session.username == undefined ? "null" : req.session,
                    visit_count: visit_count,
                    userinfo: userinfo,
                    title: "",
                    typeList: typeList
                }, 1000 * 60 * 60); // Time in ms

                res.render('index', {
                    session: req.session.username == undefined ? "null" : req.session,
                    visit_count: visit_count,
                    userinfo: userinfo,
                    title: "",
                    typeList: typeList
                });
            });
        });
    });

};

/*博客*/
exports.blog = function (req, res) {
    var blog = cache.get('blog');
    var type_id = req.query.type_id;
   logger.debug("blog:" + blog);

    if (blog != null && (blog.type_id == type_id || type_id == undefined)&&blog.session==(req.session.username == undefined ? "null" : req.session)) {
        res.render('blog', blog);

        return;


    }

    if (type_id != undefined) {

        type_id = "where ta.type_id=" + type_id;
    } else {
        type_id = "";
    }
    var article_sql = "select ta.*,tat.type_name,count(DISTINCT tac.comment_id) as comment_count,count(DISTINCT tas.scan_id) as scan_count from tb_article ta LEFT JOIN tb_articel_comment as tac on tac.article_id=ta.article_id LEFT JOIN tb_article_scan as tas  on tas.article_id=ta.article_id LEFT JOIN tb_article_type as tat  on tat.type_id=ta.type_id  " + type_id + "   GROUP  BY ta.article_id  ORDER BY  tat.type_id,  ta.create_time DESC ";
    query(article_sql, function (err, rows, fields) {
        var articleList = rows;
        var type_sql = "select article_type.* ,count(DISTINCT article.article_id) as article_count from tb_article_type article_type LEFT JOIN tb_article as article on article.type_id=article_type.type_id GROUP BY article_type.type_id";
        query(type_sql, function (err, rows, fields) {
            var type_list = rows;
            var comment_sql = "SELECT * from tb_articel_comment ORDER BY comment_time desc limit 4";
            query(comment_sql, function (err, rows, fields) {
                var comment_list = rows;
                cache.put('blog', {
                    session: req.session.username == undefined ? "null" : req.session,
                    title: "",
                    article_list: articleList,
                    type_list: type_list,
                    comment_list: comment_list,
                    type_id: req.query.type_id
                }, 1000 * 60 * 60); // Time in ms
                res.render('blog', {
                    session: req.session.username == undefined ? "null" : req.session,
                    title: "",
                    article_list: articleList,
                    type_list: type_list,
                    comment_list: comment_list
                });
            });
        });
    });

};

/*相册*/
exports.albumList = function (req, res) {

    var albumList = cache.get('albumList');

   logger.debug("albumList:" + albumList);

    if (albumList != null&&albumList.session==(req.session.username == undefined ? "null" : req.session)) {
        res.render('albumList', albumList);

        return;
    }
    var sql = "select type.*,COUNT(img.img_id) as img_count,IFNULL(img.img_url,'images/album_no_pic.gif') as cover from tb_img_type type LEFT JOIN tb_img as img on type.image_type_id=img.image_type_id GROUP BY type.image_type_id";

    query(sql, function (err, rows, fields) {
        cache.put('albumList', {
            session: req.session.username == undefined ? "null" : req.session,
            albumLis: rows,
            title: ""
        }, 1000 * 60 * 60); // Time in ms
        res.render('albumList', {
            session: req.session.username == undefined ? "null" : req.session,
            albumLis: rows,
            title: ""
        });

    });

};

/*相册列表*/
exports.albumDetail = function (req, res) {
    var image_type_id = req.query.image_type_id;
    var albumDetail = cache.get('albumDetail');

   logger.debug("albumDetail:" + albumDetail);

    if (albumDetail != null && albumDetail.image_type_i == image_type_id&&albumDetail.session==(req.session.username == undefined ? "null" : req.session)) {
        res.render('albumDetail', albumDetail);

        return;


    }

    var sql = "select * from tb_img where image_type_id=" + image_type_id;

    query(sql, function (err, rows, fields) {
        cache.put('albumDetail', {
            session: req.session.username == undefined ? "null" : req.session,
            imgList: rows,
            image_type_id: image_type_id,
            title: ""
        }, 1000 * 60 * 60); // Time in ms
        res.render('albumDetail', {
            session: req.session.username == undefined ? "null" : req.session,
            imgList: rows,
            title: ""
        });

    });

};

/*图片上传*/
exports.imgUpload = function (req, res) {
    var imgUpload = cache.get('imgUpload');

   logger.debug("imgUpload:" + imgUpload);

    if (imgUpload != null&&imgUpload.session==(req.session.username == undefined ? "null" : req.session)) {
        res.render('imgUpload', imgUpload);

        return;


    }

    var sql = "select type.*,COUNT(img.img_id) as img_count,IFNULL(img.img_url,'images/album_no_pic.gif') as cover from tb_img_type type LEFT JOIN tb_img as img on type.image_type_id=img.image_type_id GROUP BY type.image_type_id";

    query(sql, function (err, rows, fields) {
        cache.put('imgUpload', {
            session: req.session.username == undefined ? "null" : req.session,
            albumLis: rows,
            title: ""
        }, 1000 * 60 * 60); // Time in ms
        res.render('imgUpload', {
            session: req.session.username == undefined ? "null" : req.session,
            albumLis: rows,
            title: ""
        });

    });

};

/*个人档案*/
exports.profile = function (req, res) {

    var profile = cache.get('profile');

   logger.debug("profile:" + profile);

    if (profile != null&&profile.session==(req.session.username == undefined ? "null" : req.session)) {
        res.render('profile', profile);

        return;


    }
    var sql = "select * from tb_userinfo";

    query("select * from tb_article ORDER BY create_time LIMIT 10", function (err, rows, fields) {
        var articleList = rows;
        query("select * from tb_leave_msg", function (err, rows, fields) {
            var leavList = rows;
            query(sql, function (err, row, fields) {
                var userinfo = row[0];
                cache.put('profile', {
                    session: req.session.username == undefined ? "null" : req.session,
                    userinfo: userinfo,
                    leavList: leavList,
                    articleList: articleList,
                    title: ""
                }, 1000 * 60 * 60); // Time in ms
                res.render('profile', {
                    session: req.session.username == undefined ? "null" : req.session,
                    userinfo: userinfo,
                    leavList: leavList,
                    articleList: articleList,
                    title: ""
                });

            });
        });
    });

};

/*留言板*/
exports.msgBoard = function (req, res) {
    var msgBoard = cache.get('msgBoard');

   logger.debug("msgBoard:" + msgBoard);

    if (msgBoard != null&&msgBoard.session==(req.session.username == undefined ? "null" : req.session)) {
        res.render('msgBoard', msgBoard);

        return;


    }
    query("select * from tb_leave_msg", function (err, rows, fields) {
        var leavList = rows;
        cache.put('msgBoard', {
            session: req.session.username == undefined ? "null" : req.session,
            leavList: leavList,
            title: ""
        }, 1000 * 60 * 60); // Time in ms
        res.render('msgBoard', {
            session: req.session.username == undefined ? "null" : req.session,
            leavList: leavList,
            title: ""
        });
    });

};

/*管理中心*/
exports.manager = function (req, res) {
    res.render('manager', {
        session: req.session.username == null ? "null" : req.session,
        title: ""
    });
};

/*登录*/
exports.login = function (req, res) {


    res.render('login', {
        session: req.session.username == null ? "null" : req.session,
        title: ""
    });
};

/*
文章类型
*/
exports.newArticle = function (req, res) {
    var newArticle = cache.get('newArticle');

   logger.debug("newArticle:" + newArticle);

    if (newArticle != null&&newArticle.session==(req.session.username == undefined ? "null" : req.session)) {
        res.render('newArticle', newArticle);

        return;


    }
    var sql = "select * from tb_article_type";
    query(sql, function (err, rows, fields) {
        cache.put('newArticle', {
            session: req.session.username == undefined ? "null" : req.session,
            title: "",
            typeList: rows
        }, 1000 * 60 * 60); // Time in ms
        res.render('newArticle', {
            session: req.session.username == undefined ? "null" : req.session,
            title: "",
            typeList: rows
        });

    });
};
/*
修改文章类型
*/
exports.articleTypeEdit = function (req, res) {
    var articleTypeEdit = cache.get('articleTypeEdit');

   logger.debug("articleTypeEdit:" + articleTypeEdit);

    if (articleTypeEdit != null&&articleTypeEdit.session==(req.session.username == undefined ? "null" : req.session)) {
        res.render('articleTypeEdit', articleTypeEdit);

        return;


    }
    var type_sql = "select article_type.* from tb_article_type article_type";
    query(type_sql, function (err, rows, fields) {
        cache.put('articleTypeEdit', {
            session: req.session.username == undefined ? "null" : req.session,
            typeList: rows,
            title: ""
        }, 1000 * 60 * 60); // Time in ms
        res.render('articleTypeEdit', {
            session: req.session.username == undefined ? "null" : req.session,
            typeList: rows,
            title: ""
        });
    });

};

/*文章详情*/
exports.articleDetail = function (req, res) {
    var articleDetail = cache.get('articleDetail');
    var article_id = req.query.article_id;
   logger.debug("article_id:" + article_id);

    if (articleDetail != null && article_id == articleDetail.article_id&&articleDetail.session==(req.session.username == undefined ? "null" : req.session)) {
        res.render('articleDetail', articleDetail);

        return;


    }

    var type = req.query.type;
    var sql = "select ta.*,tat.type_name,count(DISTINCT tac.comment_id) as comment_count,count(DISTINCT tas.scan_id) as scan_count from tb_article ta LEFT JOIN tb_articel_comment as tac on tac.article_id=ta.article_id LEFT JOIN tb_article_scan as tas  on tas.article_id=ta.article_id LEFT JOIN tb_article_type as tat  on tat.type_id=ta.type_id where ta.article_id=" + article_id;
    var comment_sql = "SELECT * from tb_articel_comment where article_id=" + article_id + " ORDER BY comment_time desc";
    query(sql, function (err, rows, fields) {
        var article = rows;
       logger.debug("article:" + article);
        query(comment_sql, function (err, rows, fields) {
            var comment_list = rows;
            cache.put('articleDetail', {
                session: req.session.username == undefined ? "null" : req.session,
                title: "",
                article: article,
                article_id: article_id,
                comment_list: comment_list
            }, 1000 * 60 * 60); // Time in ms
            res.render('articleDetail', {
                session: req.session.username == undefined ? "null" : req.session,
                title: "",
                article: article,
                comment_list: comment_list
            });

        });

    });


};