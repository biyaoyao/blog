var BufferHelper = require('bufferhelper');



function toChinese(text) {

    var buffer = new BufferHelper();

    buffer.concat(text);

    var buf = buffer.toBuffer();

    return buf;


}
exports.toChinese = toChinese;