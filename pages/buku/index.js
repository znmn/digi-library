import { useRouter } from "next/router";
import { useState } from "react";
import { authPage } from "@/middlewares/middlewarePage";
import Sidebar from "@/components/Sidebar";
import Pagination from "@/components/Pagination";

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);

	const page = ctx.query.page || 1;
	const books = await fetch(`${process.env.HOST}/api/buku?page=${page}`)
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

	return (
		<>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Dashboard | E-Library</title>
			<link rel="stylesheet" href="/mazer/dist/assets/css/main/app.css" />
			<link rel="stylesheet" href="/mazer/dist/assets/css/main/app-dark.css" />
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
							{books.data?.map((book) => (
								<div className="col-lg-4 col-md-5" key={book.buku_id}>
									<div className="card">
										<div className="card-content">
											<div className="card-body">
												<h5 className="card-title">{book.judul_buku}</h5>
											</div>
										</div>
										<img src={book.cover_buku} width={313} height={477} />
										<ul className="list-group list-group-flush">
											<li className="list-group-item">
												<i className="bi bi-upc-scan" /> {book.isbn || "-"}
											</li>
											<li className="list-group-item">
												<i className="bi bi-person" /> {book.nama_penulis}
											</li>
											<li className="list-group-item">
												<i className="bi bi-book" /> {book.jumlah_halaman} Halaman
											</li>
											<li className="list-group-item">
												<i className="bi bi-calendar-event" /> {book.tahun_terbit}
											</li>
										</ul>
										<a href={`/peminjaman/tambah/${book.buku_id}`} className="btn btn-primary">
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
							<ul className="pagination justify-content-center">
								<Pagination pages={pages} />
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</>
	);
}
