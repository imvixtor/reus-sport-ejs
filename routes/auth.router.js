import express from 'express';
const router = express.Router();

// Đăng ký
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    let { data: emailCheckData, error: emailCheckError } = await req.supabase.rpc('check_email_registered', { email_input: email })
    if (emailCheckError) {
        req.session.error = error.message;
        return res.redirect('/signup');
    }
    if (emailCheckData) {
        req.session.error = 'Email đã được đăng ký';
        return res.redirect('/signup');
    }

    let { data, error } = await req.supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        console.error('Error signing up:', error);
        req.session.error = error.message;
        return res.redirect('/signup');
    }

    res.redirect('/emailConfirm');
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let { data: emailCheckData, error: emailCheckError } = await req.supabase.rpc('check_email_registered', { email_input: email })
    if (emailCheckError) {
        req.session.error = error.message;
        return res.redirect('/login');
    }
    if (!emailCheckData) {
        req.session.error = 'Email chưa được đăng ký';
        return res.redirect('/login');
    }

    let { data, error } = await req.supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        req.session.error = 'Sai mật khẩu hoặc email';
        return res.redirect('/login');
    }

    req.session.user = data.user;
    res.redirect('/');
});

export default router;
