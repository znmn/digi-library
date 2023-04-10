import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import authMiddleware from "@/middlewares/middleware";

export default authMiddleware(async function handle(req, res) {
	const { buku_id } = req.query;
	let success = false;
	try {
		if (req.method === "GET") {
			if (isNaN(buku_id)) return res.status(400).json({ success, message: "Invalid buku_id" });

			const buku = await prisma.buku.findUnique({ where: { buku_id: parseInt(buku_id) } });
			return buku ? res.status(200).json(buku) : res.status(404).json({ success, message: "Buku tidak ditemukan" });
		} else if (req.method === "PATCH") {
			const { isbn, judul_buku, nama_penulis, tahun_terbit, jumlah_halaman, waktu_peminjaman, cover_buku } = req.body;

			if (isbn) {
				let isExist = await prisma.buku.findUnique({ where: { isbn } });
				isExist = isExist && isExist.buku_id !== parseInt(buku_id);
				if (isExist) {
					return res.status(400).json({ success, message: "Buku dengan ISBN ini sudah ada" });
				}
			}

			const buku = await prisma.buku.update({
				where: {
					buku_id: parseInt(buku_id),
				},
				data: {
					isbn: isbn || null,
					judul_buku,
					nama_penulis,
					tahun_terbit: parseInt(tahun_terbit),
					jumlah_halaman: parseInt(jumlah_halaman),
					waktu_peminjaman: parseInt(waktu_peminjaman || 7),
					cover_buku,
				},
			});
			return res.status(200).json({
				success: true,
				data: buku,
			});
		} else if (req.method === "DELETE") {
			const buku = await prisma.buku.delete({
				where: {
					buku_id: parseInt(buku_id),
				},
			});
			return res.status(200).json({
				success: true,
				data: buku,
			});
		} else {
			return res.status(400).json({ success, message: "Method not allowed" });
		}
	} catch (err) {
		console.error(err);
		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			const message = err.meta.cause || err.message.split("invocation:\n\n\n")[1];
			return res.status(400).json({ success, message });
		}
		return res.status(500).json({ success, message: "Internal server error" });
	}
});
