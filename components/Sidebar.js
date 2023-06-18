export default function Sidebar({}) {
	return (
		<div id="sidebar" className="active">
			<div className="sidebar-wrapper active">
				<div className="sidebar-header position-relative">
					<div className="d-flex justify-content-between align-items-center">
						<div className="logo">
							<a href="/buku">E-Library</a>
						</div>
					</div>
				</div>
				<div className="sidebar-menu">
					<ul className="menu">
						<li className="sidebar-title">Menu</li>
						<li className="sidebar-item  ">
							<a href="/buku" className="sidebar-link">
								<i className="bi bi-grid-fill" />
								<span>Dashboard</span>
							</a>
						</li>
						<li className="sidebar-item  ">
							<a href="/peminjaman" className="sidebar-link">
								<i className="bi bi-grid-1x2-fill" />
								<span>Lihat Peminjaman Buku</span>
							</a>
						</li>
						<li className="sidebar-item">
							<a href="/buku/tambah" className="sidebar-link">
								<i className="bi bi-grid-1x2-fill" />
								<span>Tambah Buku Baru</span>
							</a>
						</li>
						<li className="sidebar-item">
							<form action="/auth/logout" method="GET">
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
	);
}
