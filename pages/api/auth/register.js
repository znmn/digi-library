import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export default async function handle(req, res) {
	let success = false;
	try {
		switch (req.method) {
			case "POST":
				let { nama_lengkap, no_telp, tanggal_lahir, alamat, kota, email, password } = req.body;

				if (!nama_lengkap || !no_telp || !tanggal_lahir || !alamat || !kota || !email || !password) {
					return res.status(400).json({ success, message: "nama_lengkap, no_telp, tanggal_lahir, alamat, kota, email, and password field are required" });
				}

				const isExist = await prisma.staff.findUnique({ where: { email } });
				if (isExist) {
					return res.status(400).json({ success, message: "Admin with this email already exist" });
				}

				const hashedPassword = await bcrypt.hash(password, 10);
				const admin = await prisma.staff.create({
					data: {
						nama_lengkap,
						no_telp,
						tanggal_lahir: new Date(tanggal_lahir),
						alamat,
						kota,
						email,
						password: hashedPassword,
					},
				});

				delete admin.password;

				return res.status(201).json({ success: true, data: admin });
			default:
				return res.status(405).json({ success, message: "Method not allowed" });
		}
	} catch (err) {
		console.error(err);
		if (err instanceof RangeError) {
			return res.status(400).json({ success, message: "Invalid date format" });
		}
		return res.status(500).json({ success, message: "Internal server error" });
	}
}
