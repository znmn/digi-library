import prisma from "@/lib/_prisma";
import authMiddleware from "@/lib/_middleware";

export default authMiddleware(async function handle(req, res) {
	let success = false;
	try {
		if (req.method == "GET") {
			const buku = await prisma.buku.findMany({ orderBy: { buku_id: "asc" } });
			return res.status(200).json(buku);
		} else if (req.method == "POST") {
			const { judul_buku, deskripsi, tahun_terbit, jumlah_halaman, waktu_peminjaman, cover_buku } = req.body;
			if (!judul_buku || !tahun_terbit || !jumlah_halaman || !cover_buku) {
				return res.status(400).json({ success, message: "judul_buku, tahun_terbit, jumlah_halaman, and cover_buku field are required" });
			}

			const isExist = await prisma.buku.findUnique({ where: { judul_buku } });
			if (isExist) {
				return res.status(400).json({ success, message: "Buku dengan judul ini sudah ada" });
			}

			const buku = await prisma.buku.create({
				data: {
					judul_buku,
					deskripsi,
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
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ success, message: "Internal server error" });
	}
});
