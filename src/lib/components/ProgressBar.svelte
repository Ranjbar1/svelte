<script lang="ts">
	const props = $props();
</script>

<div class="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700">
	<div
		class="h-1 rounded-full bg-blue-600 transition-all duration-100"
		style=" width:{props.progress}"
	></div>
</div>
