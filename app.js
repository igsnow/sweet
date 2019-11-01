const Koa = require('koa');
const InitManager = require('./core/init');
const parser = require('koa-bodyparser');
const cors = require('@koa/cors');
const catchError = require('./middlewares/exception');
const logger = require('./config/logConfig');
const app = new Koa();

app.use(cors());
app.use(catchError);
app.use(parser());

InitManager.initCore(app);

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

// 监控博客当前页面的总人数
let userNum = 0;
io.on('connection', function (socket) {
    userNum++;
    logger.info('a user is connected... userNum: ' + userNum);
    io.emit('total', userNum);
    // 监听链接是否断开
    socket.on('disconnect', function () {
        userNum--;
        logger.info('a user is disconnect... userNum: ' + userNum);
        io.emit('total', userNum);
    })
});

server.listen(1017);
logger.info(`server run at port 1017...`);




