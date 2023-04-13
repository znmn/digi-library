import Sidebar from "@/components/Sidebar";
import { useScript } from "@/lib/helpers";
import { useRouter } from "next/router";
import { authPage } from "@/middlewares/middlewarePage";

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);

	const peminjaman = await fetch(`http://${ctx.req.headers.host}/api/peminjaman`)
		.then((res) => res.json())
		.catch([]);
	return { props: { peminjaman } };
}

export default function Peminjaman({ peminjaman = [] }) {
	const router = useRouter();
	useScript("/mazer/dist/assets/js/extensions/datatables.js");
	useScript("/mazer/dist/assets/js/app.js");

	const handleDelete = async (e, peminjaman_id) => {
		e.preventDefault();
		const token = localStorage.getItem("token"),
			confirm = window.confirm("Yakin ingin menghapus data peminjaman ini?");
		if (!token || !peminjaman_id || !confirm) return;

		const data = await fetch(`/api/peminjaman/${peminjaman_id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((res) => res.json());

		if (data.success) {
			router.reload();
		} else {
			alert(data.message);
		}
	};

	const handleConfirm = async (e, peminjaman_id) => {
		e.preventDefault();
		const token = localStorage.getItem("token"),
			confirm = window.confirm("Yakin ingin mengkonfirmasi data peminjaman ini?");
		if (!token || !peminjaman_id || !confirm) return;

		try {
			const res = await fetch(`/api/peminjaman/${peminjaman_id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					di_kembalikan: true,
					tanggal_pengembalian: new Date().toISOString(),
				}),
			}).then((res) => res.json());

			if (res?.success) router.reload();
			else alert(res?.message || "Error: Unknown");
		} catch (e) {
			console.log(`Error Submitting data: ${e.message}`);
		}
	};

	return (
		<>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Data Peminjaman | My DigiLibrary</title>
			<link rel="stylesheet" href="/mazer/dist/assets/css/main/app.css" />
			<link rel="stylesheet" href="/mazer/dist/assets/css/main/app-dark.css" />
			<link rel="stylesheet" href="/mazer/dist/assets/css/pages/fontawesome.css" />
			<link rel="stylesheet" href="/mazer/dist/assets/css/pages/datatables.css" />
			<div id="app">
				<Sidebar />
				<div id="main">
					<header className="mb-3">
						<a href="#" className="burger-btn d-block d-xl-none">
							<i className="bi bi-justify fs-3" />
						</a>
					</header>
					<div className="page-heading">
						<div className="page-title">
							<div className="row">
								<div className="col-12 col-md-6 order-md-1 order-last">
									<h3>Data Peminjaman</h3>
								</div>
								<div className="col-12 col-md-6 order-md-2 order-first">
									<nav aria-label="breadcrumb" className="breadcrumb-header float-start float-lg-end">
										<ol className="breadcrumb">
											<li className="breadcrumb-item">Admin</li>
										</ol>
									</nav>
								</div>
							</div>
						</div>
						<section className="section">
							<div className="card mt-4">
								<div className="card-body">
									<table className="table" id="table1">
										<thead>
											<tr>
												<th>Status</th>
												<th>NIM Peminjam</th>
												<th>ISBN</th>
												<th>Judul Buku</th>
												<th>Tanggal Peminjaman</th>
												<th>Tanggal Pengembalian</th>
												<th>Action</th>
											</tr>
										</thead>
										<tbody>
											{peminjaman.data?.map((row) => (
												<tr key={row?.peminjaman_id}>
													<td>
														{row?.di_kembalikan ? (
															<p className="text-success">Sudah Dikembalikan</p>
														) : (
															<>
																<p className="text-danger">Belum Dikembalikan</p>
																<a href="#" onClick={(e) => handleConfirm(e, row?.peminjaman_id)} className="btn btn-primary">
																	Konfirmasi
																</a>
															</>
														)}
													</td>
													<td>{row?.nim_peminjam}</td>
													<td>{row.buku?.isbn || "-"}</td>
													<td>{row.buku?.judul_buku}</td>
													<td>{row.tanggal_peminjaman?.split("T")[0]}</td>
													<td>{row.tanggal_pengembalian?.split("T")[0] || "-"}</td>
													<td>
														<span className="badge bg-warning">
															<a href={`/peminjaman/${row?.peminjaman_id}`} className="text-light">
																<i className="fas fa-pen" /> Edit
															</a>
														</span>
														<span className="badge bg-danger">
															<a href="#" className="text-light" onClick={(e) => handleDelete(e, row?.peminjaman_id)}>
																<i className="fas fa-trash" /> Hapus
															</a>
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
		</>
	);
}
