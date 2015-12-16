var query=require("./util/mysql.js");  
  
query("select 1 from 1",function(err,vals,fields){  
    //do something  
}); 