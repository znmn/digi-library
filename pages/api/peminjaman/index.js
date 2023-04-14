import prisma from "@/lib/prisma";
import authMiddleware from "@/middlewares/middleware";

export default authMiddleware(async function handle(req, res) {
	const { page } = req.query,
		size = 15;
	let success = false;
	try {
		if (req.method == "GET") {
			const jumlah = await prisma.peminjaman.count(),
				orderBy = [
					{
						tanggal_peminjaman: "asc",
					},
					{
						tanggal_pengembalian: "asc",
					},
					{
						di_kembalikan: "asc",
					},
				],
				select = {
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
				};

			const peminjaman = page
				? await prisma.peminjaman.findMany({
						skip: (page - 1) * size,
						take: size,
						orderBy,
						select,
				  })
				: await prisma.peminjaman.findMany({
						orderBy,
						select,
				  });

			return res.status(200).json({ data: peminjaman, jumlah });
		} else if (req.method == "POST") {
			const { nim_peminjam, buku_id } = req.body;
			const staff_id = req.user?.userId;
			if (!nim_peminjam || !buku_id || !staff_id) return res.status(400).json({ success, message: "nim_peminjam, buku_id, and staff_id field are required" });

			const isBookExist = await prisma.buku.findUnique({ where: { buku_id } });
			if (!isBookExist) return res.status(400).json({ success, message: "Book not found" });

			const peminjaman = await prisma.peminjaman.create({
				data: {
					nim_peminjam: String(nim_peminjam),
					buku_id: Number(buku_id),
					staff_id: Number(staff_id),
				},
			});

			return res.status(200).json({
				success: true,
				data: peminjaman,
			});
		} else {
			return res.status(405).json({ success, message: "Method not allowed" });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ success, message: "Internal server error" });
	}
});
