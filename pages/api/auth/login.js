import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { encrypt } from "@/lib/encrypt";

const JWT_SECRET = process.env.JWT_SECRET,
	JWT_EXPIRY = process.env.JWT_EXPIRY;

export default async function handle(req, res) {
	let success = false;
	try {
		switch (req.method) {
			case "POST":
				const { email, password } = req.body;
				if (!email || !password) {
					return res.status(400).json({ success, message: "Email and password are required" });
				}

				const admin = await prisma.staff.findUnique({ where: { email } });
				if (!admin) {
					return res.status(400).json({ success, message: "Admin with this email does not exist" });
				}

				const isPasswordValid = await bcrypt.compare(password, admin.password);
				if (!isPasswordValid) {
					return res.status(400).json({ success, message: "Invalid password" });
				}

				let token = jwt.sign({ userId: admin.staff_id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
				token = encrypt(token);

				res.setHeader("Authorization", `Bearer ${token}`);
				res.setHeader("Set-Cookie", `token=${token}; Path=/; Max-Age=86400`);
				return res.status(200).json({
					success: true,
					token,
				});
			default:
				return res.status(405).json({ success, message: "Method not allowed" });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success, message: "Internal server error" });
	}
}
