import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { authPage } from "@/middlewares/middlewarePage";

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);

	return { props: { token } };
}

export default function Peminjaman() {
	const router = useRouter();
	const { peminjaman_id } = router.query;
	const [dataPeminjaman, setDataPeminjaman] = useState({
		peminjaman_id,
		nim_peminjam: "",
		buku: { judul_buku: "" },
		tanggal_peminjaman: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setDataPeminjaman({ ...dataPeminjaman, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const data = await fetch(`/api/peminjaman/${peminjaman_id}`, {
				method: "PATCH",
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

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) router.push("/peminjaman");

		if (peminjaman_id) {
			(async () => {
				fetch(`/api/peminjaman/${peminjaman_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then((res) => res.json())
					.then((data) => {
						if (data?.message) router.push("/peminjaman");
						else setDataPeminjaman(data);
					});
			})();
		}
	}, [peminjaman_id]);

	return (
		<>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Edit Peminjaman | My DigiLibrary</title>
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
									<h3>Edit Peminjaman</h3>
								</div>
								<div className="col-12 col-md-6 order-md-2 order-first">
									<nav aria-label="breadcrumb" className="breadcrumb-header float-start float-lg-end">
										<ol className="breadcrumb">
											<li className="breadcrumb-item">{/*?= $user['nama_awal'] ." " . $user['nama_akhir'] ?*/}</li>
										</ol>
									</nav>
								</div>
							</div>
						</div>
					</div>
					<div className="card">
						<div className="card-header">
							<h4 className="card-title">Masukkan Data Peminjaman</h4>
						</div>
						<div className="card-body">
							<form method="POST" className="form-data" id="form-data" onSubmit={handleSubmit}>
								<input type="hidden" name="peminjaman_id" defaultValue={peminjaman_id} />
								<div className="form-group">
									<label htmlFor="nim_peminjam" className="form-label">
										NIM Peminjam
									</label>
									<input type="number" name="nim_peminjam" id="nim_peminjam" value={dataPeminjaman?.nim_peminjam} className="form-control" required disabled onChange={handleChange} />
								</div>
								<div className="form-group">
									<label htmlFor="judul_buku" className="form-label">
										Judul Buku
									</label>
									<input type="text" name="judul_buku" id="judul_buku" value={dataPeminjaman.buku?.judul_buku} className="form-control" required disabled onChange={handleChange} />
								</div>
								<div className="form-group">
									<label htmlFor="tanggal_peminjaman" className="form-label">
										Tanggal Peminjaman
									</label>
									<input
										type="date"
										max={new Date().toISOString().split("T")[0]}
										name="tanggal_peminjaman"
										id="tanggal_peminjaman"
										value={dataPeminjaman.tanggal_peminjaman?.split("T")[0]}
										className="form-control"
										required
										onChange={handleChange}
									/>
								</div>
								<button type="submit" name="submit" className="btn btn-primary simpan" id="simpan">
									Submit
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
