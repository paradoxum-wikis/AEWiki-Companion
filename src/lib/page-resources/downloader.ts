export async function downloadImage(
	imageUrl: string,
	filename: string,
): Promise<void> {
	const response = await fetch(imageUrl);
	if (!response.ok) {
		throw new Error(`Failed to fetch image: ${response.statusText}`);
	}

	const blob = await response.blob();
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(link.href);
}
