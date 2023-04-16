export default function ErrorIgnore() {
	return (
		<>
			{process.env.NODE_ENV !== "production" && (
				<script
					dangerouslySetInnerHTML={{
						__html: `window.addEventListener('error', event => {\n  event.stopImmediatePropagation()\n})\n\nwindow.addEventListener('unhandledrejection', event => {\n  event.stopImmediatePropagation()\n})`,
					}}
				/>
			)}
		</>
	);
}
