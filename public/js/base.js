/*******head.jsp*****************/

/*******login.jsp**************/
function refresh() {
	//showError($("#randimg").attr("src"));
	$("#randimg").attr("src","/randCode?para"+ new Date().getTime());
}
function getUrl(){
	var url=window.parent.location.href;
	var i=url.indexOf("#");
	var j=url.lastIndexOf(".");
	if(i>0)	surl=url.substring(0,i);
	if(j>0){aurl=url.substring(j+1);if(aurl=="do") surl="goindex.htm";}
	return surl;
}

function to(url){
	top.location.href=url;
}

function check(name,pass,rand){
	
	if(!/^\w{4,15}$/.test(name)){
		showError("用户名长度为4-15位,且不能为中文和特殊符号");return false;
	}
	if(!(/^\w{8,15}$/).test(pass)){
		showError("密码长度为8-15位,且不能为中文和特殊符号");return false;
	}
	if(!(/^\w{4}$/).test(rand)){
		showError("验证码长度为4位,且只能为数字和字母组合");return false;
	}
	
	return true;
}

function showError(data){
	$(".error").text(data).fadeIn("fast").fadeOut(3000);
}

/*******index.jsp{main.jsp}*************************/
function setStatus(){
	var myblog="欢迎光临我的Blog!";
	var olink = document.links; 
	for(var i=0;i<olink.length;i=i+1) { 
		olink[i].onmouseover=function(){window.status=myblog;return true;} 
		//解决.按住鼠标不松开还是会显示链接地址 
		olink[i].onfocus=function(){window.status=myblog;return true;} 
	} 
}

function login(){
	
	g_pop=new Popup({ contentType:1,isReloadOnClose:false,width:'400',height:'250'});
	g_pop.setContent("title","登陆");
	g_pop.setContent("scrollType","no");
	g_pop.setContent("contentUrl","login");
	g_pop.build();
	g_pop.show();
}
function logout(){
	if(!confirm("确定要退出吗?")){
        
        return;
    }
	$.getJSON("logout.action",{}, function(res){
		
		
		if(res.result){
			
			
			showError(res.tips);
			parent.location.reload();
			
		}else{
			
			showError(res.tips);
			
		}
	  });
}
function LoginAction(){
	
	var user_name=$("#user").val();
	var password=$("#pass").val();
	var rand=$("#code").val();
	if(check(user_name,password,rand)){

		$.getJSON("login.action",{user_name:user_name,password:password,rand:rand}, function(res){
			
			
			if(res.result){
				
				
				showError(res.tips);
				parent.location.reload();
				
			}else{
				
				showError(res.tips);
				refresh();
			}
		  });
		
	}
	
	
}




function slide(classname,obj){
	$("div ."+classname).slideToggle("slow");
	var html=$("a."+obj);
	if(html.html()=="[&nbsp;收&nbsp;起&nbsp;]"){
		html.html("[&nbsp;展&nbsp;开&nbsp;]");
	}else{
		html.html("[&nbsp;收&nbsp;起&nbsp;]");
	}
}