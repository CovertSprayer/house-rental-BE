const jwt = require('jsonwebtoken');

module.exports.verifyUser = (req, res, next) => {
    const token = req.cookies.token || null;
    // console.log(token);
    if (!token) return res.status(400).json({ message: "No Token Found" })

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.status(400).json({ message: "Not Authorized" });
    console.log('Verified token succesfully');
    next();
}