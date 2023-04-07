import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function Logout() {
	const router = useRouter();

	useEffect(() => {
		localStorage.removeItem("token");
		Cookies.remove("token");

		router.push("/login");
	}, []);

	return (
		<>
			<title>Logout...</title>
		</>
	);
}
