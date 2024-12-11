<script lang="ts">
	interface Props {
		show: boolean;
		onClose: () => void;
		onSubmit: () => void;
		submitText?: string;
		submitEnabled?: boolean;
		title: string;
		children: any;
	}
	let {
		show,
		onClose,
		onSubmit,
		title,
		children,
		submitText,
		submitEnabled = true
	}: Props = $props();
</script>

<dialog class="relative z-10" onclose={onClose}>
	<div class="fixed inset-0 overflow-y-auto">
		<div class="flex min-h-full items-center justify-center p-4 text-center">
			<div
				class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
			>
				<h3>{title}</h3>

				<div class="mt-3 text-sm text-gray-500">
					{@render children()}
				</div>

				<div class="mt-4 flex flex-row-reverse">
					{#if submitText}
						<button
							type="button"
							disabled={!submitEnabled}
							class={`ml-4 inline-flex justify-center rounded-md border border-transparent ${
								submitEnabled ? 'bg-indigo-600' : 'bg-grey-300'
							} px-4 py-2 text-sm font-medium text-indigo-100 ${
								submitEnabled
									? 'hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'
									: ''
							} transition-all duration-300`}
							onclick={onSubmit}
						>
							{submitText}
						</button>
					{/if}
					<button
						type="button"
						class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 transition-all duration-300 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
						onclick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
</dialog>
