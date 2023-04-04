import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET,
	JWT_EXPIRY = process.env.JWT_EXPIRY;

export default function authMiddleware(handler) {
	return async (req, res) => {
		const token = req.headers.authorization?.replace("Bearer ", "");
		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		try {
			const decoded = jwt.verify(token, JWT_SECRET);

			if (decoded.exp <= Date.now() / 1000) {
				const newToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
					expiresIn: JWT_EXPIRY,
				});

				res.setHeader("Authorization", `Bearer ${newToken}`);
			}

			req.user = decoded;

			return handler(req, res);
		} catch (err) {
			return res.status(401).json({ message: "Unauthorized" });
		}
	};
}
