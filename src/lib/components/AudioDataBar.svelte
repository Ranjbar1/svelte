<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	let props = $props();
</script>

<ProgressBar progress={`${Math.round(props.progress * 100)}%`} />
