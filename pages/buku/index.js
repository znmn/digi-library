import { useRouter } from "next/router";
import { useState } from "react";
import React from "react";
import { authPage } from "@/middlewares/middlewarePage";

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);

	const page = ctx.query.page || 1;
	const books = await fetch(`http://${ctx.req.headers.host}/api/buku?page=${page}`)
		.then((res) => res.json())
		.catch([]);
	return { props: { books } };
}

export default function Buku({ books }) {
	const router = useRouter(),
		{ page } = router.query;

	const [pages, setPages] = useState({
		current: parseInt(page) || 1,
		total: Math.ceil(books.jumlah / 15),
	});

	const handleDelete = async (e, buku_id) => {
		e.preventDefault();
		const token = localStorage.getItem("token"),
			confirm = window.confirm("Yakin ingin menghapus buku ini?");
		if (!token || !buku_id || !confirm) return;

		const data = await fetch(`/api/buku/${buku_id}`, {
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

	const renderPagination = () => {
		const startNum = pages.current > 1 ? pages.current - 1 : 1,
			endNum = pages.current < pages.total - 1 ? pages.current + 1 : pages.total;
		let pg = [];

		const isFirst = pages.current == 1,
			isLast = pages.current == pages.total;

		pg.push(
			<React.Fragment key={"first"}>
				<li className={`page-item ${isFirst ? "disabled" : "halaman"}`} id="1" key={"first"}>
					<a className="page-link" href="?page=1">
						First
					</a>
				</li>
				<li className={`page-item ${isFirst ? "disabled" : "halaman"}`} id={pages.current - 1} key={pages.current - 1}>
					<a className="page-link" href={`?page=${pages.current - 1}`}>
						<span aria-hidden="true">&laquo;</span>
					</a>
				</li>
			</React.Fragment>
		);

		for (let i = startNum; i <= endNum; i++) {
			const link_active = pages.current == i ? " active" : "";

			pg.push(
				<React.Fragment key={i}>
					<li className={`page-item halaman ${link_active}`} id={i}>
						<a className="page-link" href={`?page=${i}`}>
							{i}
						</a>
					</li>
				</React.Fragment>
			);
		}

		const link_next = pages.current < pages.total ? pages.current + 1 : pages.total;
		pg.push(
			<React.Fragment key={"last"}>
				<li className={`page-item ${isLast ? "disabled" : "halaman"}`} id={link_next}>
					<a className="page-link" href={`?page=${link_next}`}>
						<span aria-hidden="true">&raquo;</span>
					</a>
				</li>
				<li className={`page-item ${isLast ? "disabled" : "halaman"}`} id={pages.total}>
					<a className="page-link" href={`?page=${pages.total}`}>
						Last
					</a>
				</li>
			</React.Fragment>
		);
		return pg;
	};

	return (
		<>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Dashboard | My DigiLibrary</title>
			<link rel="stylesheet" href="/mazer/dist/assets/css/main/app.css" />
			<link rel="stylesheet" href="/mazer/dist/assets/css/main/app-dark.css" />
			<link rel="shortcut icon" href="/mazer/dist/assets/images/logo/favicon.svg" type="image/x-icon" />
			<link rel="shortcut icon" href="/mazer/dist/assets/images/logo/favicon.png" type="image/png" />
			<div id="app">
				<div id="sidebar" className="active">
					<div className="sidebar-wrapper active">
						<div className="sidebar-header position-relative">
							<div className="d-flex justify-content-between align-items-center">
								<div className="logo">
									<a href="dashboard.php">My DigiLibrary</a>
								</div>
							</div>
						</div>
						<div className="sidebar-menu">
							<ul className="menu">
								<li className="sidebar-title">Menu</li>
								<li className="sidebar-item  ">
									<a href="index_admin.php" className="sidebar-link">
										<i className="bi bi-grid-fill" />
										<span>Dashboard</span>
									</a>
								</li>
								<li className="sidebar-item  ">
									<a href="form_peminjaman.php" className="sidebar-link">
										<i className="bi bi-grid-1x2-fill" />
										<span>Buat Peminjaman Buku</span>
									</a>
								</li>
								<li className="sidebar-item  ">
									<a href="data_peminjam_admin.php" className="sidebar-link">
										<i className="bi bi-grid-1x2-fill" />
										<span>Lihat Peminjaman Buku</span>
									</a>
								</li>
								<li className="sidebar-item">
									<a href="form_buku_baru.php" className="sidebar-link">
										<i className="bi bi-grid-1x2-fill" />
										<span>Tambah Buku Baru</span>
									</a>
								</li>
								<li className="sidebar-item">
									<form action="/logout" method="POST">
										<button type="submit" className="sidebar-link">
											<i className="bi bi-box-arrow-right" />
											<span>Logout</span>
										</button>
									</form>
								</li>
							</ul>
						</div>
					</div>
				</div>
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
									<h3>Dashboard</h3>
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
					</div>
					<div id="data" className="mt-4">
						<div className="row">
							{books.data.map((book) => (
								<div className="col-lg-4 col-md-5" key={book.buku_id}>
									<div className="card">
										<div className="card-content">
											<div className="card-body">
												<h5 className="card-title">{book.judul_buku}</h5>
											</div>
										</div>
										<img src={book.cover_buku} />
										<ul className="list-group list-group-flush">
											<li className="list-group-item">
												<i className="bi bi-person" /> {book.nama_penulis}
											</li>
											<li className="list-group-item">
												<i className="bi bi-journal-text" /> {book.deskripsi}
											</li>
											<li className="list-group-item">
												<i className="bi bi-book" /> {book.jumlah_halaman} Halaman
											</li>
											<li className="list-group-item">
												<i className="bi bi-calendar-event" /> {book.tahun_terbit}
											</li>
										</ul>
										<a href="#" className="btn btn-primary">
											Pinjam
										</a>
										<a href={`/buku/${book.buku_id}`} className="btn btn-warning">
											Edit
										</a>
										<a href="#" id={book.buku_id} onClick={(e) => handleDelete(e, book.buku_id)} className="btn btn-danger">
											Hapus
										</a>
									</div>
								</div>
							))}
						</div>
						<br />
						<nav className="mb-5">
							<ul className="pagination justify-content-center">{renderPagination()}</ul>
						</nav>
					</div>
				</div>
			</div>
		</>
	);
}
