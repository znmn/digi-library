import { parseCookies } from "../lib/helpers";
import { verify } from "jsonwebtoken";

export function unAuthPage(ctx) {
	return new Promise((resolve) => {
		const { token } = parseCookies(ctx.req.headers.cookie);
		try {
			const decodedToken = verify(token, process.env.JWT_SECRET);
			return ctx.res
				.writeHead(302, {
					Location: "/buku",
				})
				.end();
		} catch (err) {
			return resolve({ token });
		}
	});
}

export function authPage(ctx) {
	const url = ctx.req.url;
	if (url.includes("/login") || url.includes("/register")) return;

	return new Promise((resolve) => {
		const { token } = parseCookies(ctx.req.headers.cookie);
		try {
			const decodedToken = verify(token, process.env.JWT_SECRET);
			return resolve({
				token,
			});
		} catch (err) {
			return ctx.res
				.writeHead(302, {
					Location: "/login",
				})
				.end();
		}
	});
}
