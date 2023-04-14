import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authPage } from "@/middlewares/middlewarePage";
import Sidebar from "@/components/Sidebar";

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);
	return { props: { token } };
}

export default function TambahPeminjaman({}) {
	const router = useRouter();
	const { buku_id } = router.query,
		now = new Date().toISOString().split("T")[0];
	const [dataPeminjaman, setDataPeminjaman] = useState({
		buku_id,
		nim_peminjam: "",
		buku: { judul_buku: "" },
	});

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) router.push("/peminjaman");

		if (buku_id) {
			(async () => {
				fetch(`/api/buku/${buku_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then((res) => res.json())
					.then((data) => {
						if (data?.message) router.push("/peminjaman");
						else setDataPeminjaman({ ...dataPeminjaman, buku: data, buku_id: data?.buku_id });
					});
			})();
		}
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setDataPeminjaman({ ...dataPeminjaman, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const data = await fetch(`/api/peminjaman`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(dataPeminjaman),
			}).then((res) => res.json());

			if (data?.success) router.push("/peminjaman");
			else alert(data?.message || "Error: Unknown");
		} catch (e) {
			console.log(`Error Submitting data: ${e.message}`);
		}
	};

	return (
		<>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Peminjaman | E-Library</title>
			<link rel="stylesheet" href="/mazer/dist/assets/css/main/app.css" />
			<link rel="stylesheet" href="/mazer/dist/assets/css/main/app-dark.css" />
			<style
				dangerouslySetInnerHTML={{
					__html:
						"\n        #ui-id-1 {\n            background-color: white;\n            /* list-style: none; */\n            border: blue 2px solid;\n            width: 100px;\n        }\n\n        #ui-id-2 {\n            background-color: white;\n            /* list-style: none; */\n            border: blue 2px solid;\n            width: 100px;\n        }\n\n        #ui-id-3 {\n            background-color: white;\n            /* list-style: none; */\n            border: blue 2px solid;\n            width: 100px;\n        }\n    ",
				}}
			/>
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
									<h3>Form Peminjaman</h3>
								</div>
								<div className="col-12 col-md-6 order-md-2 order-first">
									<nav aria-label="breadcrumb" className="breadcrumb-header float-start float-lg-end">
										<ol className="breadcrumb">Admin</ol>
									</nav>
								</div>
							</div>
						</div>
					</div>
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Silahkan Isi Form Terlebih Dahulu</h4>
						</div>
						<div className="card-body">
							<form method="POST" className="form-data" id="form-data" onSubmit={handleSubmit}>
								<div className="form-group">
									<label htmlFor="nim_peminjam" className="form-label">
										NIM Peminjam
									</label>
									<input type="text" name="nim_peminjam" id="nim_peminjam" className="form-control" placeholder="Masukkan NIM" required onChange={handleChange} />
								</div>
								<div className="mb-3">
									<label htmlFor="judul_buku" className="form-label">
										Judul Buku
									</label>
									<input type="text" name="judul_buku" id="judul_buku" className="form-control" placeholder="Masukkan Judul Buku" defaultValue={dataPeminjaman.buku?.judul_buku} required disabled />
									<input type="hidden" name="buku_id" id="buku_id" defaultValue={dataPeminjaman?.buku_id} />
								</div>
								<div className="mb-3">
									<label htmlFor="tanggal_peminjaman" className="form-label">
										Tanggal Peminjaman
									</label>
									<input type="date" name="tanggal_peminjaman" id="tanggal_peminjaman" className="form-control" min={now} required value={now} onChange={handleChange} />
								</div>
								<button type="submit" name="submit" className="btn btn-primary simpan" id="simpan">
									Submit
								</button>
							</form>
						</div>
					</div>
				</div>
				{/* Row */}
				{/* ============================================================== */}
				{/* End PAge Content */}
				{/* ============================================================== */}
			</div>
		</>
	);
}
