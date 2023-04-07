import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authPage } from "@/middlewares/middlewarePage";
import Sidebar from "@/components/Sidebar";

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);
	return { props: { token } };
}

export default function Buku() {
	const router = useRouter();
	const { buku_id } = router.query;
	const [dataBuku, setDataBuku] = useState({
		buku_id,
		judul_buku: "",
		nama_penulis: "",
		jumlah_halaman: 0,
		tahun_terbit: 0,
		cover_buku: "",
	});

	const handleInput = async (e) => {
		e.preventDefault();
		if (
			parseInt(buku_id) < 1 ||
			!dataBuku.judul_buku.trim() ||
			!dataBuku.nama_penulis.trim() ||
			parseInt(dataBuku.jumlah_halaman) == 0 ||
			parseInt(dataBuku.tahun_terbit) < 1000 ||
			!dataBuku.cover_buku.trim()
		) {
			alert("Semua data harus diisi dengan valid");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`/api/buku/${buku_id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(dataBuku),
			}).then((res) => res.json());

			if (res?.success) router.push("/buku");
			else console.log(res?.message || "Error: Unknown");
		} catch (e) {
			console.log(`Error Submitting data: ${e.message}`);
		}
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setDataBuku({ ...dataBuku, [name]: value });
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) router.push("/buku");

		if (buku_id) {
			(async () => {
				fetch(`/api/buku/${buku_id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then((res) => res.json())
					.then((data) => {
						if (data?.message) router.push("/buku");
						else setDataBuku(data);
					});
			})();
		}
	}, [buku_id]);
	return (
		<>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Edit Data Buku | E-Library</title>
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
									<h3>Form Edit Data Buku</h3>
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
							<h4 className="card-title">Edit Data Buku</h4>
						</div>
						<div className="card-body">
							<form method="POST" className="form-data" id="form-data">
								<div className="form-group">
									<input type="hidden" name="buku_id" id="buku_id" defaultValue={dataBuku?.buku_id} onChange={handleChange} />
									<label htmlFor="judul_buku" className="form-label">
										Judul Buku
									</label>
									<input type="text" name="judul_buku" id="judul_buku" className="form-control" placeholder="Masukkan Judul Buku" required defaultValue={dataBuku?.judul_buku} onChange={handleChange} />
								</div>
								<div className="form-group">
									<label htmlFor="nama_penulis" className="form-label">
										Nama Penulis
									</label>
									<input type="text" name="nama_penulis" id="nama_penulis" className="form-control" placeholder="Masukkan Nama Penulis" required defaultValue={dataBuku?.nama_penulis} onChange={handleChange} />
								</div>
								<div className="mb-3">
									<label htmlFor="jumlah_halaman" className="form-label">
										Jumlah Halaman
									</label>
									<input
										type="number"
										name="jumlah_halaman"
										id="jumlah_halaman"
										className="form-control"
										placeholder="Masukkan Jumlah Halaman"
										required
										defaultValue={dataBuku?.jumlah_halaman}
										onChange={handleChange}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="tahun_terbit" className="form-label">
										Tahun Terbit
									</label>
									<input
										type="number"
										name="tahun_terbit"
										id="tahun_terbit"
										className="form-control"
										placeholder="Masukkan Tahun Terbit"
										required
										defaultValue={dataBuku?.tahun_terbit}
										onChange={handleChange}
									/>
								</div>
								<div className="mb-3">
									<label htmlFor="cover_buku" className="form-label">
										Cover Image (URL)
									</label>
									<input
										type="text"
										name="cover_buku"
										id="cover_buku"
										className="form-control"
										placeholder="Masukkan URL Cover Buku"
										required
										defaultValue={dataBuku?.cover_buku}
										onChange={handleChange}
										disabled
									/>
								</div>
								<button type="submit" name="submit" className="btn btn-primary simpan" id="simpan" onClick={handleInput}>
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
