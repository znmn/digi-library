import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

const secret = process.env.JWT_SECRET;

export default function authMiddleware(handler) {
	return async (req, res) => {
		try {
			const token = Cookies.get("token");
			const decodedToken = jwt.verify(token, secret);
			req.user = decodedToken;
			return handler(req, res);
		} catch (err) {
			return {
				redirect: {
					destination: "/login",
					permanent: false,
				},
			};
		}
	};
}
