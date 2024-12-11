<script lang="ts">
	import Constants from '$lib/utils/Constants';
	import Modal from './Modal.svelte';
	import UrlInput from './UrlInput.svelte';

	const props: {
		show: boolean;
		onSubmit: (url: string) => void;
		onClose: () => void;
	} = $props();
	let url = $state(Constants.DEFAULT_AUDIO_URL);

	const onChange = (event: { target: { value: string } }) => {
		url = event.target.value;
	};

	const onSubmit = () => {
		props.onSubmit(url);
	};
</script>

<Modal
	show={props.show}
	title={'From URL'}
	onClose={props.onClose}
	submitText={'Load'}
	{onSubmit}
>
	'Enter the URL of the audio file you want to load.'
	<UrlInput onchange={onChange} value={url} />
</Modal>
