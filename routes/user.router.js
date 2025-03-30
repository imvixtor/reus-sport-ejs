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

userRouter.get('/verify-otp', async (req, res) => {
    res.render('otp', { title: 'Xác nhận email - Reus sport', user: null });
});

userRouter.get('/profile', requireAuth, async (req, res) => {
    let { data: profiles, error } = await req.supabase
        .from('profiles')
        .select('*')
        .eq('uid', req.session.user.id)
    res.render('profile', { title: 'Hồ sơ - Reus sport', user: req.session.user, profile: profiles[0] });
});

userRouter.get('/profile-edit', requireAuth, async (req, res) => {
    let { data: profiles, error } = await req.supabase
        .from('profiles')
        .select('*')
        .eq('uid', req.session.user.id)
    res.render('profile-edit', { title: 'Chỉnh sửa hồ sơ - Reus sport', user: req.session.user, profile: profiles[0] });
});

userRouter.get('/logout', async (req, res) => {
    await req.supabase.auth.signOut();
    req.session.destroy();
    res.redirect('/');
});

userRouter.post('/profile/update', requireAuth, async (req, res) => {
    const { first_name, last_name, phone, address } = req.body;
    const { data, error } = await req.supabase
        .from('profiles')
        .update({ first_name, last_name, phone, address })
        .eq('uid', req.session.user.id);

    if (error) {
        console.error('Error updating user profile:', error);
        return res.redirect('/500');
    }

    res.redirect('/profile');
});

export default userRouter;