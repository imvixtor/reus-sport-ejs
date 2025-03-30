import express from 'express';
import session from 'express-session';
import supabase from './configs/supabaseClient.js';

const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));

app.use(session({
    secret: 'reus-sport',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 } // Để `false` khi chạy local, `true` khi chạy production
}));

// Middleware lưu Supabase vào request
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});
//middleware tự xóa session error khi đã hiển thị
app.use((req, res, next) => {
    res.locals.error = req.session.error || null;
    req.session.error = null;
    next();
});

app.get('/', (req, res) => {
    res.render('index', { title: 'Reus sport', user: req.session.user });
});
app.get('/404', (req, res) => {
    res.render('404', { title: '404 Not Found', user: req.session.user });
});
app.get('/500', (req, res) => {
    res.render('500', { title: '500 Error', user: req.session.user });
});

//routes
import userRouter from './routes/user.router.js';
app.use('/', userRouter);
import authRouter from './routes/auth.router.js';
app.use('/auth', authRouter);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
