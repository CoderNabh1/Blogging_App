const {validateToken} = require("../Services/Auth.js")
function checkforAuthenticationCookie(cookie) {
    return (req,res,next) => {
        const tokenCookieValue = req.cookies[cookieName]
        if(!tokenCookieValue){
            next();
        }

        try{
            const userPayLoad = validateToken(tokenCookieValue);
            req.user = userPayLoad;
        }
        catch(error)
        {

        }
        next();
    };
}

module.exports = {checkforAuthenticationCookie};