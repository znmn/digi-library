import React from "react";

export default function Pagination({ pages: { current, total } }) {
	if (!current || !total) return;

	const renderPagination = () => {
		const startNum = current > 1 ? current - 1 : 1,
			endNum = current < total - 1 ? current + 1 : total;
		let pg = [];

		const isFirst = current == 1,
			isLast = current == total;

		pg.push(
			<React.Fragment key={"first"}>
				<li className={`page-item ${isFirst ? "disabled" : "halaman"}`} id="1" key={"first"}>
					<a className="page-link" href="?page=1">
						First
					</a>
				</li>
				<li className={`page-item ${isFirst ? "disabled" : "halaman"}`} id={current - 1} key={current - 1}>
					<a className="page-link" href={`?page=${current - 1}`}>
						<span aria-hidden="true">&laquo;</span>
					</a>
				</li>
			</React.Fragment>
		);

		for (let i = startNum; i <= endNum; i++) {
			const link_active = current == i ? " active" : "";

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

		const link_next = current < total ? current + 1 : total;
		pg.push(
			<React.Fragment key={"last"}>
				<li className={`page-item ${isLast ? "disabled" : "halaman"}`} id={link_next}>
					<a className="page-link" href={`?page=${link_next}`}>
						<span aria-hidden="true">&raquo;</span>
					</a>
				</li>
				<li className={`page-item ${isLast ? "disabled" : "halaman"}`} id={total}>
					<a className="page-link" href={`?page=${total}`}>
						Last
					</a>
				</li>
			</React.Fragment>
		);
		return pg;
	};

	return renderPagination();
}
