import express from 'express';
import requireAuth from '../middlewares/requireAuth.middleware.js';
const cartRouter = express.Router();

cartRouter.get('/cart', requireAuth, async (req, res) => {
    return res.redirect('/404');
});

export default cartRouter;