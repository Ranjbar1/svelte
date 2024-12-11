export interface MessageEventHandler {
	(event: MessageEvent): void;
}

export function useWorker(messageEventHandler: MessageEventHandler): Worker {
	// Create new worker once and never again
	const worker = $state(() => createWorker(messageEventHandler));
	return worker as unknown as Worker;
}

function createWorker(messageEventHandler: MessageEventHandler): Worker {
	const worker = new Worker(new URL('/service-worker.js', import.meta.url), {
		type: 'module'
	});
	// Listen for messages from the Web Worker
	worker.addEventListener('message', messageEventHandler);
	return worker;
}
