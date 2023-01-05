import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import colors from 'colors';
import { onSearch } from './src/mothed/index.js';

const __dirname = path.resolve();
const app = express();
const port = 8022;

app.use(express.static(path.join(__dirname, 'src/static')));
// 设置模板引擎
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');



//定义一个路由,此处未使用express中的Router
app.get('/', function(req, res, next) {
    res.render('index', {  });
});
app.use('/search', async (request, response) => {
    const res = await onSearch(request);
    response.send(res);
});
app.listen(port, () => {
    console.log(`server running @ http://localhost:${port}`);
});

export default app;