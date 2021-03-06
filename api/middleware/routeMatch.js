// PACKAGES //
var path = require('path');

// IMPORTS //
var routes = require('../../common/routes');

module.exports = function(req, res, next) {
    var directRoutes   = routes.direct,
        redirectRoutes = routes.redirect,
        slice          = req.originalUrl.slice(0,4),
        url            = req.originalUrl;
    // ignore api requests
    if(slice == '/api') return next();

    // check for url query params
    if(url.includes('?')) {
        url = req.originalUrl.substring(0, req.originalUrl.indexOf('?'));
    };

    // send index.html for direct urls and allow React Router to route from client
    var direct = directRoutes.includes(url);
    if(direct) {
        return res.sendFile(path.join(__dirname, '../../client/src/index.html'));
    };

    // redirect routes to /
    var redirect = redirectRoutes.includes(url);
    if(redirect) {
        return res.redirect('/');
    };

    // send 404 routes to error handler
    return next();
};
