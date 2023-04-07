import { useRouter } from "next/router";
import { useState } from "react";
import Cookies from "js-cookie";
import { unAuthPage } from "@/middlewares/middlewarePage";

export async function getServerSideProps(ctx) {
	await unAuthPage(ctx);
	return { props: {} };
}

export default function login() {
	const router = useRouter();
	const [dataLogin, setDataLogin] = useState({
		email: "",
		password: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setDataLogin({ ...dataLogin, [name]: value });
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!Object.values(dataLogin).every((field) => field.trim())) {
			alert("Email dan Password tidak boleh kosong");
			return;
		}

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dataLogin),
			}).then((res) => res.json());

			if (res?.success) {
				localStorage.setItem("token", res?.token);
				Cookies.set("token", res?.token, { expires: process.env.COOKIE_EXPIRE });
				router.push("/buku");
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
			<link rel="icon" type="image/png" sizes="16x16" href="/assets/img/logo(2).png" />
			<title>My DigiLibrary | Sistem Informasi Peminjaman Buku</title>
			{/* Bootstrap Core CSS */}
			<link href="/template/assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
			{/* chartist CSS */}
			<link href="/template/assets/plugins/c3-master/c3.min.css" rel="stylesheet" />
			{/* Custom CSS */}
			<link href="/template/html/css/style.css" rel="stylesheet" />
			{/* You can change the theme colors from here */}
			<link href="/template/html/css/colors/blue.css" id="theme" rel="stylesheet" />
			{/* HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries */}
			{/* WARNING: Respond.js doesn't work if you view the page via file:// */}
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
									<form action="#" method="POST">
										<div className="col-md-12">
											<h3 align="center">Halaman Login Admin</h3>
											<hr />
											<div className="mt-3 form-group">
												<label htmlFor="email" style={{ marginLeft: "2%" }}>
													Email:
												</label>
												<input type="text" id="email" name="email" placeholder="Email : nancysmith24@gmail.com" className="form form-lg form-control mt-2" onChange={handleChange} />
											</div>
											<div className="mt-3 mb-3 form-group">
												<label htmlFor="password" style={{ marginLeft: "2%" }}>
													Password:
												</label>
												<input type="password" id="password" name="password" placeholder="Password : admin_secret1" className="form form-lg form-control mt-2" onChange={handleChange} />
											</div>
											<p>
												Belum punya akun? <a href="/register">Register</a>
											</p>
										</div>
										<button type="submit" name="submit" className="btn btn-primary col-md-12 col-xs-12 mt-3" onClick={handleLogin}>
											Login
										</button>
										<br />
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
