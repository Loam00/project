

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    console.log(authHeader);
    if(!req.isLoggedIn) {
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }

    req.isLoggedIn = true;
    next();
};