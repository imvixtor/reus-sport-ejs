const authMiddleware = async (req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user.user;
    } else {
        res.locals.user = null;
    }
    next();
};

export default authMiddleware;