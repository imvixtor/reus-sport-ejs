import session from 'express-session';

const sessionManager = session({
    secret: 'reus-sport',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 300000 }
})

export default sessionManager;