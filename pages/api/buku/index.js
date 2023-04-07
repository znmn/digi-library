import prisma from "@/lib/prisma";
import authMiddleware from "@/middlewares/middleware";

export default authMiddleware(async function handle(req, res) {
	const { page } = req.query,
		size = 15;
	let success = false;
	try {
		if (req.method == "GET") {
			const jumlah = await prisma.buku.count(),
				buku = page
					? await prisma.buku.findMany({
							skip: (page - 1) * size,
							take: size,
							orderBy: {
								judul_buku: "asc",
							},
					  })
					: await prisma.buku.findMany({
							orderBy: {
								judul_buku: "asc",
							},
					  });
			return res.status(200).json({ data: buku, jumlah });
		} else if (req.method == "POST") {
			const { judul_buku, nama_penulis, deskripsi, tahun_terbit, jumlah_halaman, waktu_peminjaman, cover_buku } = req.body;
			if (!judul_buku || !tahun_terbit || !nama_penulis || !jumlah_halaman || !cover_buku) {
				return res.status(400).json({ success, message: "judul_buku, nama_penulis, tahun_terbit, jumlah_halaman, and cover_buku field are required" });
			}

			// const isExist = await prisma.buku.findUnique({ where: { judul_buku } });
			// if (isExist) {
			// 	return res.status(400).json({ success, message: "Buku dengan judul ini sudah ada" });
			// }

			const buku = await prisma.buku.create({
				data: {
					judul_buku,
					nama_penulis,
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
