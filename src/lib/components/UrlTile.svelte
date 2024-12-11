<script lang="ts">
	import Tile from './Tile.svelte';
	import UrlModal from './UrlModal.svelte';

	const props: {
		text: string;
		onUrlUpdate: (url: string) => void;
	} = $props();
	let showModal = $state(false);

	const onClick = () => {
		showModal = true;
	};

	const onClose = () => {
		showModal = false;
	};

	const onSubmit = (url: string) => {
		props.onUrlUpdate(url);
		onClose();
	};
</script>

<Tile text={props.text} {onclick} />
<UrlModal show={showModal} {onSubmit} {onClose} />
