import prisma from "@/lib/prisma";
import authMiddleware from "@/middlewares/middleware";

export default authMiddleware(async function handle(req, res) {
	const { peminjaman_id } = req.query;
	let success = false;

	if (isNaN(peminjaman_id)) return res.status(400).json({ success, message: "Invalid peminjaman_id" });

	const dataPeminjaman = await prisma.peminjaman.findUnique({
		where: {
			peminjaman_id: parseInt(peminjaman_id),
		},
		select: {
			peminjaman_id: true,
			tanggal_peminjaman: true,
			tanggal_pengembalian: true,
			di_kembalikan: true,
			nim_peminjam: true,
			buku: {
				select: {
					judul_buku: true,
					isbn: true,
				},
			},
			staff: {
				select: {
					nama_lengkap: true,
				},
			},
		},
	});
	if (!dataPeminjaman) return res.status(404).json({ success, message: "Data Peminjaman tidak ditemukan" });

	try {
		if (req.method === "GET") {
			return res.status(200).json(dataPeminjaman);
		} else if (req.method === "PATCH") {
			const { tanggal_peminjaman, tanggal_pengembalian, di_kembalikan } = req.body;
			if ((!tanggal_pengembalian || typeof di_kembalikan != "boolean") && !tanggal_peminjaman) return res.status(400).json({ success, message: "Invalid request body" });

			let data;
			if (tanggal_peminjaman) {
				data = {
					tanggal_peminjaman: new Date(tanggal_peminjaman),
					tanggal_pengembalian: null,
					di_kembalikan: false,
				};
			} else {
				data = {
					tanggal_peminjaman: new Date(dataPeminjaman.tanggal_peminjaman),
					tanggal_pengembalian: new Date(tanggal_pengembalian),
					di_kembalikan,
				};
			}
			const peminjaman = await prisma.peminjaman.update({
				where: {
					peminjaman_id: parseInt(peminjaman_id),
				},
				data,
			});
			return res.status(200).json({
				success: true,
				data: peminjaman,
			});
		} else if (req.method === "DELETE") {
			const peminjaman = await prisma.peminjaman.delete({
				where: {
					peminjaman_id: parseInt(peminjaman_id),
				},
			});
			return res.status(200).json({
				success: true,
				data: peminjaman,
			});
		} else {
			return res.status(400).json({ success, message: "Method not allowed" });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success, message: "Internal server error" });
	}
});
