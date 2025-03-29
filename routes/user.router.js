import express from 'express';
import requireAuth from '../middlewares/requireAuth.middleware.js';
const userRouter = express.Router();

userRouter.get('/login', (req, res) => {
    res.render('login', { title: 'Đăng nhập - Reus sport', user: null });
});

userRouter.get('/signup', async (req, res) => {
    res.render('signup', { title: 'Đăng ký - Reus sport', user: null });
});

userRouter.get('/emailConfirm', async (req, res) => {
    res.render('emailConfirm', { title: 'Xác nhận email - Reus sport', user: null });
});

userRouter.get('/profile', requireAuth, async (req, res) => {
    console.log(req.session.user);
    res.render('profile', { title: 'Hồ sơ - Reus sport', user: req.session.user });
});

userRouter.get('/logout', async (req, res) => {
    await req.supabase.auth.signOut();
    req.session.destroy();
    res.redirect('/');
});

export default userRouter;