<script lang="ts">
	import AudioManager from '$lib/components/AudioManager.svelte';
	import { useTranscriber } from '$lib/components/Transcriber.svelte';
	import Transcript from '$lib/components/Transcript.svelte';

	const transcriber = useTranscriber();
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="container flex flex-col items-center justify-center">
		<h1
			class="text-center text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl"
		>
			Whisper Web
		</h1>
		<h2
			class="text-1xl mb-5 mt-3 px-4 text-center font-semibold tracking-tight text-slate-900 sm:text-2xl"
		>
			ML-powered speech recognition directly in your browser
		</h2>
		<AudioManager {transcriber} />

		<Transcript transcribedData={transcriber.output} />
	</div>

	<div class="absolute bottom-4">
		Made with
		<a class="underline" href="https://github.com/xenova/transformers.js">
			🤗 Transformers.js
		</a>
	</div>
</div>
