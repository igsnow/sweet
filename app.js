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

app.listen(1017);
logger.info(`server run at port ${PORT}...`);

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
io.on('connection', function (socket) {
    logger.info('a user is connected...');
    io.emit('total', 'add');
    // 监听链接是否断开
    socket.on('disconnect', function () {
        logger.info('a user is disconnect...');
        io.emit('total', 'red');
    })
});
