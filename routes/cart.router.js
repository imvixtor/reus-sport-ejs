import express from 'express';
import requireAuth from '../middlewares/requireAuth.middleware.js';
const cartRouter = express.Router();

cartRouter.get('/cart', requireAuth, async (req, res) => {
    return res.render('cart', { title: 'Giỏ hàng - Reus sport', user: req.session.user });
});

cartRouter.get('/checkout', requireAuth, async (req, res) => {
    return res.render('checkout', { title: 'Đặt hàng - Reus sport', user: req.session.user });
});

cartRouter.get('/checkout/complete', requireAuth, async (req, res) => {
    return res.render('checkout-complete', { title: 'Đặt hàng thành công - Reus sport', user: req.session.user });
});

export default cartRouter;