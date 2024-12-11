<script lang="ts">
	import { formatAudioTimestamp } from '../utils/AudioUtils';
	import { webmFixDuration } from '../utils/BlobFix';

	function getMimeType() {
		const types = [
			'audio/webm',
			'audio/mp4',
			'audio/ogg',
			'audio/wav',
			'audio/aac'
		];
		for (let type of types) {
			if (MediaRecorder.isTypeSupported(type)) {
				return type;
			}
		}
		return undefined;
	}
	let { onRecordingComplete } = $props() as {
		onRecordingComplete: (blob: Blob) => void;
	};
	let recording = $state(false);
	let duration = $state(0);
	let recordedBlob = $state<Blob | null>(null);
	let mediaRecorder: MediaRecorder | null = null;
	let stream: MediaStream | null = null;
	let chunks: Blob[] = [];
	let audio: HTMLAudioElement | null = null;
	const startRecording = async () => {
		// Reset recording (if any)
		recordedBlob = null;

		let startTime = Date.now();

		try {
			if (!stream) {
				stream = await navigator.mediaDevices.getUserMedia({
					audio: true
				});
			}

			const mimeType = getMimeType();
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType
			});

			mediaRecorder.addEventListener('dataavailable', async (event) => {
				if (event.data.size > 0) {
					chunks.push(event.data);
				}
				if (mediaRecorder.state === 'inactive') {
					const duration = Date.now() - startTime;

					// Received a stop event
					let blob = new Blob(chunks, { type: mimeType });

					if (mimeType === 'audio/webm') {
						blob = await webmFixDuration(blob, duration, blob.type);
					}

					recordedBlob = blob;
					onRecordingComplete(blob);

					chunks = [];
				}
			});
			mediaRecorder.start();
			recording = true;
		} catch (error) {
			console.error('Error accessing microphone:', error);
		}
	};
	const stopRecording = () => {
		if (
			mediaRecorder &&
			(mediaRecorder as MediaRecorder).state === 'recording'
		) {
			(mediaRecorder as MediaRecorder).stop(); // set state to inactive
			duration = 0;
			recording = false;
		}
	};
	$effect(() => {
		let stream: MediaStream | null = null;

		if (recording) {
			const timer = setInterval(() => {
				duration += 1;
			}, 1000);

			return () => {
				clearInterval(timer);
			};
		}

		return () => {
			if (stream) {
				(stream as MediaStream).getTracks().forEach((track) => track.stop());
			}
		};
	});
	const handleToggleRecording = () => {
		if (recording) {
			stopRecording();
		} else {
			startRecording();
		}
	};
</script>

<div class="flex flex-col items-center justify-center">
	<button
		type="button"
		class={`m-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
			recording
				? 'bg-red-500 hover:bg-red-600'
				: 'bg-green-500 hover:bg-green-600'
		}`}
		onclick={handleToggleRecording}
	>
		{recording
			? `Stop Recording (${formatAudioTimestamp(duration)})`
			: 'Start Recording'}
	</button>

	{#if recordedBlob}
		<audio class="w-full" bind:this={audio} controls>
			<source
				src={URL.createObjectURL(recordedBlob)}
				type={recordedBlob.type}
			/>
		</audio>
	{/if}
</div>
