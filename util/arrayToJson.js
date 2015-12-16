function foo(array){
    
    var root,holder;
    for(var i=0;i<array.length;i++){
        
        if(i==0){
            
            holder=root={};
        }else{
            
            holder=holder[array[i-1]]={};
            
        }
        holder[array[i]]=null;
    }
    
    
    return root;
    
}

console.log(JSON.stringify(foo(['XX','YY','ZZ','bb'])));