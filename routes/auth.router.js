import express from 'express';
const router = express.Router();

// Đăng ký
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    let { data: emailRegisted, error: emailCheckError } = await req.supabase.rpc('check_email_registered', { email_input: email })
    if (emailCheckError) {
        req.session.error = error.message;
        return res.redirect('/signup');
    }
    if (emailRegisted) {
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

    req.session.email = email;
    res.redirect('/verify-otp');
});

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    let { data: emailRegisted, error: emailCheckError } = await req.supabase.rpc('check_email_registered', { email_input: email })
    if (emailCheckError) {
        console.error('Error checking email:', emailCheckError);
        return res.redirect('/500');
    }
    if (!emailRegisted) {
        req.session.error = 'Email chưa được đăng ký';
        return res.redirect('/login');
    }

    let { data: emailVerified, error: emailVerifyErr } = await req.supabase.rpc('check_email_verify', { email_input: email });
    if (emailVerifyErr) {
        console.error('Error checking email verification:', emailVerifyErr);
        return res.redirect('/500');
    }
    if (!emailVerified) {
        req.session.error = 'Email chưa được xác thực';
        req.session.email = email;
        return res.redirect('/verify-otp');
    }

    let { data, error } = await req.supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        req.session.error = 'Sai mật khẩu hoặc email';
        return res.redirect('/login');
    }

    console.log('data', data);
    req.session.user = data.user;
    res.redirect('/');
});

// xác thực email với otp
router.post('/verify-otp', async (req, res) => {
    const otp = req.body.otp;
    const email = req.session.email;

    let { data: verifyData, error: verifyErr } = await req.supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
    });

    if (verifyErr) {
        console.error('Error verifying OTP:', verifyErr);
        return res.redirect('/500');
    }

    let { data, error } = await req.supabase.from('profiles').insert([
        { uid: verifyData.user.id, first_name: '', last_name: '', phone: '', address: '' },
    ]).select()

    if (error) {
        req.session.error = error.message;
        return res.redirect('/500');
    }

    console.log('data', data);
    req.session.profile = data[0];
    req.session.user = verifyData.user;
    res.redirect('/profile-edit');
});

// gửi lại otp

export default router;
