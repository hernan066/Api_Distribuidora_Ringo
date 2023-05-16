/* eslint-disable no-unreachable */
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
	/* const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log(token) */
	const token = req.header('x-token');

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) console.log(err);
		return res.sendStatus(403).json({
			err,
		}); // invalid token
		req.user = decoded.UserInfo.id;
		req.role = decoded.UserInfo.role;
		next();
	});
};

module.exports = verifyJWT;
