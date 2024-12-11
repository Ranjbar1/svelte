<script lang="ts">
	const { text, onclick } = $props();
</script>

<button
	{onclick}
	class="bg-blue flex items-center justify-center rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
>
	{#if text}
		<div class="break-text text-md w-30 ml-2 text-center">{text}</div>
	{/if}
</button>
