<script lang="ts">
	import axios from 'axios';
	import Constants from '$lib/utils/Constants';
	import Progress from './Progress.svelte';
	import VerticalBar from './VerticalBar.svelte';
	import AudioDataBar from './AudioDataBar.svelte';
	import UrlTile from './UrlTile.svelte';
	import FileTile from './FileTile.svelte';

	enum AudioSource {
		URL = 'URL',
		FILE = 'FILE',
		RECORDING = 'RECORDING'
	}
	const props: { transcriber: any } = $props();
	// const props: { transcriber: Transcriber  } = $props();
	let progress: number | undefined = $state(undefined);
	let audioData = $state<
		| {
				buffer: AudioBuffer;
				url: string;
				source: AudioSource;
				mimeType: string;
		  }
		| undefined
	>(undefined);
	let audioDownloadUrl = $state<string | undefined>(undefined);
	let isAudioLoading = $derived(progress !== undefined);
	const resetAudio = () => {
		audioData = undefined;
		audioDownloadUrl = undefined;
	};
	const setAudioFromDownload = async (data: ArrayBuffer, mimeType: string) => {
		const audioCTX = new AudioContext({
			sampleRate: Constants.SAMPLING_RATE
		});
		const blobUrl = URL.createObjectURL(new Blob([data], { type: 'audio/*' }));
		const decoded = await audioCTX.decodeAudioData(data);
		audioData = {
			buffer: decoded,
			url: blobUrl,
			source: AudioSource.URL,
			mimeType: mimeType
		};
	};
	const setAudioFromRecording = async (data: Blob) => {
		resetAudio();
		progress = 0;
		const blobUrl = URL.createObjectURL(data);
		const fileReader = new FileReader();
		fileReader.onprogress = (event) => {
			progress = event.loaded / event.total || 0;
		};
		fileReader.onloadend = async () => {
			const audioCTX = new AudioContext({
				sampleRate: Constants.SAMPLING_RATE
			});
			const arrayBuffer = fileReader.result as ArrayBuffer;
			const decoded = await audioCTX.decodeAudioData(arrayBuffer);
			progress = undefined;
			audioData = {
				buffer: decoded,
				url: blobUrl,
				source: AudioSource.RECORDING,
				mimeType: data.type
			};
		};
		fileReader.readAsArrayBuffer(data);
	};
	const downloadAudioFromUrl = async (
		requestAbortController: AbortController
	) => {
		if (audioDownloadUrl) {
			try {
				audioData = undefined;
				progress = 0;
				const { data, headers } = (await axios.get(audioDownloadUrl, {
					signal: requestAbortController.signal,
					responseType: 'arraybuffer',
					onDownloadProgress(progressEvent) {
						progress = progressEvent.progress || 0;
					}
				})) as {
					data: ArrayBuffer;
					headers: { 'content-type': string };
				};

				let mimeType = headers['content-type'];
				if (!mimeType || mimeType === 'audio/wave') {
					mimeType = 'audio/wav';
				}
				setAudioFromDownload(data, mimeType);
			} catch (error) {
				console.log('Request failed or aborted', error);
			} finally {
				progress = undefined;
			}
		}
	};
	$effect(() => {
		if (audioDownloadUrl) {
			const requestAbortController = new AbortController();
			downloadAudioFromUrl(requestAbortController);
			return () => {
				requestAbortController.abort();
			};
		}
	});
</script>

<div
	class="flex flex-col items-center justify-center rounded-lg bg-white shadow-xl shadow-black/5 ring-1 ring-slate-700/10"
>
	<div class="flex w-full flex-row space-x-2 px-2 py-2">
		<UrlTile
			text={'From URL'}
			onUrlUpdate={(e) => {
				props.transcriber.onInputChange();
				audioDownloadUrl = e;
			}}
		/>
		<VerticalBar />
		<FileTile
			text={'From file'}
			onFileUpdate={(decoded, blobUrl, mimeType) => {
				props.transcriber.onInputChange();
				audioData = {
					buffer: decoded,
					url: blobUrl,
					source: AudioSource.FILE,
					mimeType: mimeType
				};
			}}
		/>
		<!-- {#if navigator.mediaDevices}
			<VerticalBar />
			<RecordTile
				icon={(<MicrophoneIcon />)}
				text={'Record'}
				setAudioData={(e) => {
					props.transcriber.onInputChange();
					audioFromRecording(e);
				}}
			/>
		{/if} -->
	</div>
	<AudioDataBar progress={isAudioLoading ? progress : +!!audioData} />
</div>

<!-- {#if audioData}
	<AudioPlayer audioUrl={audioData.url} mimeType={audioData.mimeType} />

	<div class="relative flex w-full items-center justify-center">
		<TranscribeButton
			onClick={() => {
				props.transcriber.start(audioData.buffer);
			}}
			isModelLoading={props.transcriber.isModelLoading}
			isTranscribing={props.transcriber.isBusy}
		/>

		<SettingsTile
			class="absolute right-4"
			transcriber={props.transcriber}
			icon={(<SettingsIcon />)}
		/>
	</div>
	{#if props.transcriber.progressItems.length > 0}
		<div class="relative z-10 w-full p-4">
			<span>Loading model files... (only run once)</span>
			{#each props.transcriber.progressItems as data, i (data.file)}
				<div>
					<Progress text={data.file} percentage={data.progress} />
				</div>
			{/each}
		</div>
	{/if}
{/if} -->
