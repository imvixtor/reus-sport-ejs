import express from 'express';
import session from 'express-session';

//middlewares
import authMiddleware from './utils/authMiddleware.js';

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Reus sport', user: req.session.user });
});

//routes
import userRouter from './routes/user.router.js';
app.use('/', userRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
