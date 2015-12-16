var log4js=require("log4js");
var date = new Date();
log4js.configure({
    appenders: [
        {
            type: 'console'
        }, {
            type: 'file',
            filename: 'public/logs/' + date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + '.log',
            maxLogSize: 1024,
            backups: 4,
            category: 'normal'
    }
  ],
    replaceConsole: true
});

module.exports=log4js.getLogger('normal');