<script lang="ts">
	import type { TranscriberData } from './Transcriber.svelte';
	import { formatAudioTimestamp } from '../utils/AudioUtils';

	interface Props {
		transcribedData: TranscriberData | undefined;
	}
	const { transcribedData }: Props = $props();

	let div: HTMLDivElement | null = null;

	const saveBlob = (blob: Blob, filename: string) => {
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.click();
		URL.revokeObjectURL(url);
	};
	const exportTXT = () => {
		let chunks = transcribedData?.chunks ?? [];
		let text = chunks
			.map((chunk) => chunk.text)
			.join('')
			.trim();

		const blob = new Blob([text], { type: 'text/plain' });
		saveBlob(blob, 'transcript.txt');
	};
	const exportJSON = () => {
		let jsonData = JSON.stringify(transcribedData?.chunks ?? [], null, 2);

		// post-process the JSON to make it more readable
		const regex = /(    "timestamp": )\[\s+(\S+)\s+(\S+)\s+\]/gm;
		jsonData = jsonData.replace(regex, '$1[$2 $3]');

		const blob = new Blob([jsonData], { type: 'application/json' });
		saveBlob(blob, 'transcript.json');
	};

	// Scroll to the bottom when the component updates
	$effect(() => {
		if (div) {
			const diff = Math.abs(
				(div as HTMLDivElement).offsetHeight +
					(div as HTMLDivElement).scrollTop -
					(div as HTMLDivElement).scrollHeight
			);

			if (diff <= 64) {
				// We're close enough to the bottom, so scroll to the bottom
				(div as HTMLDivElement).scrollTop = (
					div as HTMLDivElement
				).scrollHeight;
			}
		}
	});
</script>

<div
	bind:this={div}
	class="my-2 flex max-h-[20rem] w-full flex-col overflow-y-auto p-4"
>
	{#if transcribedData?.chunks}
		{#each transcribedData.chunks as chunk, i (chunk)}
			<div
				class="mb-2 flex w-full flex-row rounded-lg bg-white p-4 shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
			>
				<div class="mr-5">{formatAudioTimestamp(chunk.timestamp[0])}</div>
				{chunk.text}
			</div>
		{/each}
	{/if}
	{#if transcribedData && !transcribedData.isBusy}
		<div class="w-full text-right">
			<button
				onclick={exportTXT}
				class="mr-2 inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-600 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>
				Export TXT
			</button>
			<button
				onclick={exportJSON}
				class="mr-2 inline-flex items-center rounded-lg bg-green-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-600 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
			>
				Export JSON
			</button>
		</div>
	{/if}
</div>
