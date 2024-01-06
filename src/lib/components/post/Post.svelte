<script lang="ts">
	import Document from '@tiptap/extension-document';
	import Placeholder from '@tiptap/extension-placeholder';
	import StarterKit from '@tiptap/starter-kit';
	import { Image as TipTapImage } from '@tiptap/extension-image';
	import { Editor } from '@tiptap/core';
	import { onDestroy, onMount } from 'svelte';
	import { SlashMenu } from '$lib/plugins/slash';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { handleDrop } from './utils/handleDrop';

	export let editable: boolean = false;
	export let id = '';
	export let content: string =
		localStorage.getItem(`post-${id}`) || localStorage.getItem('post') || 'Add title';

	let element: Element;
	let editor: Editor;

	let saveTimeout: any;

	const postSavedToastSettings: ToastSettings = {
		message: 'Your post has been saved',
		timeout: 2000
	};

	const postSavedLocallyToastSettings: ToastSettings = {
		message: 'Your post has been saved locally',
		timeout: 2000
	};

	const toastStore = getToastStore();

	const handleSendPost = () => {
		const contentToSend = editor.getHTML();
		const hasContentChanged = contentToSend !== content;
		if (contentToSend.length < 30 || !hasContentChanged) {
			return;
		}

		const updating = id !== '';

		const getTitle = () => {
			const headings = editor.getHTML().match(/<h1[^>]*>([^<]+)<\/h1>/i);
			const title = headings ? headings[1] : '';
			return title;
		};

		const getImage = () => {
			const images = editor.getHTML().match(/<img[^>]*src="([^"]*)"[^>]*>/i);
			const image = images ? images[1] : '/src/lib/assets/images/placeholder.png';
			return image;
		};

		const onSuccess = (savedId?: string) => {
			updating ? localStorage.removeItem(`post-${id}`) : localStorage.removeItem('post');
			id = savedId || id;
			toastStore.trigger(postSavedToastSettings);
			content = contentToSend;
		};

		const onFailure = () => {
			updating
				? localStorage.setItem(`post-${id}`, contentToSend)
				: localStorage.setItem('post', contentToSend);
			content = contentToSend;
			toastStore.trigger(postSavedLocallyToastSettings);
		};

		const body = JSON.stringify({ title: getTitle(), content: contentToSend, image: getImage() });
		const headers = {
			'Content-Type': 'application/json'
		};

		if (updating) {
			fetch(`/api/posts/${id}`, {
				method: 'PUT',
				headers,
				body
			})
				.then((res) => {
					if (res.status !== 200) {
						onFailure();
						return null;
					}
					return res.json();
				})
				.then((data) => {
					if (data) onSuccess();
				})
				.catch(() => {
					onFailure();
				});
		} else {
			fetch('/api/posts', {
				method: 'POST',
				headers,
				body
			})
				.then((res) => {
					if (res.status !== 201) {
						console.log('res nie 201');
						onFailure();
						return null;
					}
					return res.json();
				})
				.then((data) => {
					if (data) onSuccess(data.id);
				})
				.catch(() => {
					console.log('catch');
					onFailure();
				});
		}
	};

	const CustomDocument = Document.extend({
		content: 'heading block+'
	});

	onMount(() => {
		editor = new Editor({
			content,
			element,
			editorProps: {
				handleDrop,
				attributes: {
					class: `prose justify-self-center focus:outline-none ${
						editable ? 'editable' : 'non-editable'
					} max-w-full`
				}
			},
			extensions: [
				CustomDocument,
				SlashMenu,
				TipTapImage,
				StarterKit.configure({
					document: false
				}),
				Placeholder.configure({
					placeholder: "Type '/' for commands"
				})
			],
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},

			onUpdate: async ({ editor }) => {
				if (!editable) {
					return;
				}

				if (saveTimeout) {
					clearTimeout(saveTimeout);
				}
				saveTimeout = setTimeout(async () => {
					await handleSendPost();
				}, 2000);
			},

			onDestroy: () => {
				if (saveTimeout) {
					clearTimeout(saveTimeout);
				}
			}
		});

		editor.setEditable(editable);
	});

	onDestroy(async () => {
		if (saveTimeout) {
			clearTimeout(saveTimeout);
			await handleSendPost();
		}
	});
</script>

<div class="mx-12 grid" bind:this={element} />

<style>
	:global(.prose.non-editable) {
		@apply w-full xl:w-[1280px] xl:p-12;
	}

	:global(.prose.editable) {
		@apply w-[1280px] p-12;
	}

	:global(.prose img) {
		@apply w-full rounded-lg shadow-lg;
	}
</style>
