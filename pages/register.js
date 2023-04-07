import { useRouter } from "next/router";
import { useState } from "react";
import { unAuthPage } from "@/middlewares/middlewarePage";

export async function getServerSideProps(ctx) {
	await unAuthPage(ctx);
	return { props: {} };
}

export default function Register() {
	const router = useRouter();
	const [dataUser, setDataUser] = useState({
		email: "",
		password: "",
		kode_daftar: "",
		nama_lengkap: "",
		no_telp: "",
		tanggal_lahir: "",
		alamat: "",
		kota: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setDataUser({ ...dataUser, [name]: value });
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		if (!Object.values(dataUser).every((field) => field.trim())) {
			alert("Semua data harus diisi");
			return;
		}

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dataUser),
			}).then((res) => res.json());

			if (res?.success) {
				alert("Berhasil mendaftar, silahkan login");
				router.push("/login");
			} else alert(res?.message || "Error: Unknown");
		} catch (e) {
			console.log(`Error Submitting data: ${e.message}`);
		}
	};
	return (
		<>
			<meta charSet="utf-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			{/* Tell the browser to be responsive to screen width */}
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="description" content="" />
			<meta name="author" content="" />
			{/* Favicon icon */}
			<link rel="icon" type="image/png" sizes="16x16" href="assets/img/logo(2).png" />
			<title>My DigiLibrary | Sistem Informasi Peminjaman Buku</title>
			{/* Bootstrap Core CSS */}
			<link href="/template/assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
			{/* chartist CSS */}
			<link href="/template/assets/plugins/chartist-js/dist/chartist.min.css" rel="stylesheet" />
			<link href="/template/assets/plugins/chartist-js/dist/chartist-init.css" rel="stylesheet" />
			<link href="/template/assets/plugins/chartist-plugin-tooltip-master/dist/chartist-plugin-tooltip.css" rel="stylesheet" />
			{/*This page css - Morris CSS */}
			<link href="/template/assets/plugins/c3-master/c3.min.css" rel="stylesheet" />
			{/* Custom CSS */}
			<link href="/template/html/css/style.css" rel="stylesheet" />
			{/* You can change the theme colors from here */}
			<link href="/template/html/css/colors/blue.css" id="theme" rel="stylesheet" />
			{/* HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries */}
			<div className="container-lg">
				{/* Outer Row */}
				<div className="row justify-content-center">
					<div className="col-xl-5 col-lg-6 col-md-8">
						<center>
							<img src="/assets/img/logo(2).png" style={{ maxWidth: 100, marginTop: "10%" }} />
							<h1 className="mt-5">My DigiLibrary</h1>
						</center>
						<div className="card o-hidden border-3 shadow-lg" style={{ marginTop: "10%", marginBottom: "25%" }}>
							<div className="card-body col-md-12 mx-auto">
								{/* Nested Row within Card Body */}
								<div className=" d-none d-lg-block" />
								<div className=" mt-2">
									<form action="#" method="POST" id="form-data" className="form-data">
										<div className="col-md-12">
											<h3 align="center">Halaman Register Admin</h3>
											<hr />
											<div className="mt-3 form-group">
												<label htmlFor="email" style={{ marginLeft: "2%" }}>
													Email:
												</label>
												<input type="text" id="email" name="email" placeholder="Masukkan email anda" className="form form-lg form-control mt-2" required onChange={handleChange} />
											</div>
											<div className="mt-3 mb-3 form-group">
												<label htmlFor="password" style={{ marginLeft: "2%" }}>
													Password:
												</label>
												<input type="password" id="password" name="password" placeholder="Masukkan password anda" className="form form-lg form-control mt-2" required onChange={handleChange} />
											</div>
											<div className="mt-3 mb-3 form-group">
												<label htmlFor="kode_daftar" style={{ marginLeft: "2%" }}>
													kode Daftar:
												</label>
												<input type="kode_daftar" id="kode_daftar" name="kode_daftar" placeholder="Masukkan kode daftar" className="form form-lg form-control mt-2" required onChange={handleChange} />
											</div>
											<div className="mt-3 form-group">
												<label htmlFor="nama_lengkap" style={{ marginLeft: "2%" }}>
													Nama:
												</label>
												<input type="text" id="nama_lengkap" name="nama_lengkap" placeholder="Masukkan nama lengkap Anda" className="form form-lg form-control mt-2" required onChange={handleChange} />
											</div>
											<div className="mt-3 form-group">
												<label htmlFor="no_telp" style={{ marginLeft: "2%" }}>
													No Telepon:
												</label>
												<input type="number" id="no_telp" name="no_telp" placeholder="Masukkan nomor telepon Anda" className="form form-lg form-control mt-2" required onChange={handleChange} />
											</div>
											<div className="mt-3 form-group">
												<label htmlFor="alamat" style={{ marginLeft: "2%" }}>
													Alamat:
												</label>
												<input type="text" id="alamat" name="alamat" placeholder="Masukkan alamat Anda" className="form form-lg form-control mt-2" required onChange={handleChange} />
											</div>
											<div className="mt-3 form-group">
												<label htmlFor="kota" style={{ marginLeft: "2%" }}>
													Kota:
												</label>
												<input type="text" id="kota" name="kota" placeholder="Masukkan alamat Anda" className="form form-lg form-control mt-2" required onChange={handleChange} />
											</div>
											<div className="mt-3 form-group">
												<label htmlFor="tanggal_lahir" style={{ marginLeft: "2%" }}>
													Tanggal Lahir:
												</label>
												<input type="date" id="tanggal_lahir" name="tanggal_lahir" placeholder="Masukkan tanggal lahir Anda" className="form form-lg form-control mt-2" required onChange={handleChange} />
											</div>
											<div>
												<p className="mt-3">
													Sudah punya akun? <a href="/login">Login</a>
												</p>
											</div>
											<button type="submit" name="submit" className="btn btn-primary col-md-12 col-xs-12 mt-3" onClick={handleRegister}>
												Submit
											</button>
											<br />
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
