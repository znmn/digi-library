import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
				<link rel="shortcut icon" href="/favicon.png" type="image/png" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
