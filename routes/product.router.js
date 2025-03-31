import express from 'express';
import requireAuth from '../middlewares/requireAuth.middleware.js';
const productRouter = express.Router();

productRouter.get('/product/category/:id', async (req, res) => {
    const { id } = req.params;

    let { data, error } = await req.supabase.rpc('get_product_colors_by_category', { cat_id: id });
    if (error) console.error(error)

    return res.render('products', {
        title: `${data[0].category_name} - Reus sport`,
        user: req.session.user,
        products: data,
        category_id: id,
    });
});

productRouter.get('/product/:id', async (req, res) => {
    const { id } = req.params;

    let { data, error } = await req.supabase.rpc('get_product_color_by_id', { color_id: id });
    if (error) console.error(error)

    let { data: product_colors, error: fetchPColorsErr } = await req.supabase.from('product_colors').select('*').eq('product_id', data[0].product_id);
    if (fetchPColorsErr) console.error(fetchPColorsErr)

    res.render('product', {
        title: 'Chi tiết sản phẩm - Reus sport',
        user: req.session.user,
        products: data,
        product_id: data[0].product_id,
        product_colors: product_colors,
    });
});

export default productRouter;