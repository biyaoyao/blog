 var action = require('../action/action');

/**
 * 
 ----------------------------------------------------------页面----开始----------------------------------------------end
 */

/*
主页
*/
exports.index = function(req, res){
	action.homeAction(req, res);  
    
};

/*博客*/
exports.blog = function(req, res){
    	action.blogAction(req, res);
    
    
	 
};

/*相册*/
exports.albumList = function(req, res){
    action.albumListAction(req, res);  
	  
};

/*相册列表*/
exports.albumDetail = function(req, res){
    action.albumDetailAction(req, res);  
	  
};

/*图片上传*/
exports.imgUpload = function(req, res){
     action.imgUploadAction(req, res);  
	 
};

/*个人档案*/
exports.profile = function(req, res){
     action.profileAction(req, res);
	  
};

/*留言板*/
exports.msgBoard = function(req, res){
      action.msgBoardAction(req, res);
	 
};

/*管理中心*/
exports.manager = function(req, res){
	  res.render('manager', { session: req.session.username==null?"null":req.session,title:"" });
};

/*登录*/
exports.login = function(req, res){
	  res.render('login', { session: req.session.username==null?"null":req.session,title:"" });
};

/*
发表文章
*/
exports.newArticle = function(req, res){
	 action.articleTypeAction(req, res);
    
};
/*
修改文章类型
*/
exports.articleTypeEdit = function(req, res){
     action.articleTypeEditAction(req, res);
	  
};

/*文章详情*/
exports.articleDetail = function(req, res){
    action.articleDetailAction(req, res);
    
	 
};




