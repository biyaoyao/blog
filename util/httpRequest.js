



/*
exports.getClientIp=function(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    };
*/

exports.getClientIp = function (req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0] 
  || req.connection.remoteAddress;
};

exports.ajax=function(url) {
   
    
    nodegrass.get(url, function(data, status, headers) {
        
        return data;
    }, 'gbk').on('error', function(e) {
        
        return e.message;
    });
}