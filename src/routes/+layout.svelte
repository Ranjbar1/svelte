<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="relative">
	<nav class="sticky top-0 flex h-14 max-w-full items-center bg-pink-400">
		<ul class="mx-[auto] flex w-[80%] gap-4">
			<li><a href="/">home</a></li>
		</ul>
	</nav>
	{@render children()}
</div>
