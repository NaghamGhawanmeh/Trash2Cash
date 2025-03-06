const jwt =require("jsonwebtoken")
const authentication = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ").pop();
        
        try {
            const verification = await jwt.verify(token, process.env.SECRET);
            req.token = verification;
            next();
        } catch (error) {
            res.status(401).json("The token is invalid or expired");
        }
    } else {
        return res.status(403).json({
            success: false,
            message: "Forbidden"
        });
    }
}

module.exports = authentication;