export async function getServerSideProps(ctx) {
	ctx.res
		.writeHead(302, {
			Location: "/login",
		})
		.end();
	return { props: {} };
}

export default function Index() {
	return <></>;
}
