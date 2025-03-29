import express from 'express';
import supabase from '../configs/supabaseClient.js';
import sessionManager from '../configs/sessionManager.js';

const userRouter = express.Router();

userRouter.use(sessionManager);

userRouter.get('/login', (req, res) => {
    res.render('login', { title: 'Đăng nhập - Reus sport' });
});

userRouter.get('/signup', async (req, res) => {
    res.render('signup', { title: 'Đăng ký - Reus sport' });
});

userRouter.get('/emailConfirm', async (req, res) => {
    res.render('emailConfirm', { title: 'Xác nhận email - Reus sport' });
});

// Đăng ký
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return res.send('Lỗi đăng ký: ' + error.message);
    req.session.user = data.user;
    res.redirect('/');
});

// Đăng nhập
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.send('Lỗi đăng nhập: ' + error.message);
    req.session.user = data.user;
    res.redirect('/');
});

// Đăng xuất
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

export default userRouter;