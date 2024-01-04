<script lang="ts">
	import Document from '@tiptap/extension-document';
	import Placeholder from '@tiptap/extension-placeholder';
	import StarterKit from '@tiptap/starter-kit';
	import { Image as TipTapImage } from '@tiptap/extension-image';
	import { Editor } from '@tiptap/core';
	import { onDestroy, onMount } from 'svelte';
	import type { EditorView } from 'prosemirror-view';
	import type { Slice } from 'prosemirror-model';
	import { SlashMenu } from '$lib/plugins/slash';
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	export let editable: boolean = true;
	export let content: string = 'Add title';
	export let id = '';

	let editing: boolean = id === '' && editable ? false : true;

	let element: Element;
	let editor: Editor;

	let saveTimeout: any;

	const t: ToastSettings = {
		message: 'Your post has been saved',
		timeout: 2000
	};
	const toastStore = getToastStore();

	const handleSendPost = () => {
		const currentContent = editor.getHTML();

		if (currentContent.length < 30 || currentContent === content) {
			return;
		}

		editing = id === '' && editable ? false : true;
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

		const image = getImage();
		const title = getTitle();

		if (editing) {
			fetch(`/api/posts/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ title, content: currentContent, image })
			})
				.then((res) => res.json())
				.then((data) => {
					content = currentContent;
					toastStore.trigger(t);
				})
				.catch((err) => console.log(err));
		} else {
			fetch('/api/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ title, content: currentContent, image })
			})
				.then((res) => res.json())
				.then((data) => {
					id = data.id;
					content = currentContent;
					toastStore.trigger(t);
				})
				.catch((err) => console.log(err));
		}
	};

	const CustomDocument = Document.extend({
		content: 'heading block+'
	});

	function uploadImage(file: any) {
		const data = new FormData();
		data.append('file', file);

		return fetch('/api/files/upload', {
			method: 'POST',
			body: data
		});
	}

	function handleDrop(view: EditorView, event: DragEvent, slice: Slice, moved: boolean) {
		if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
			let file = event.dataTransfer.files[0]; // the dropped file
			let filesize = (file.size / 1024 / 1024).toFixed(4); // get the filesize in MB
			if ((file.type === 'image/jpeg' || file.type === 'image/png') && filesize < '10') {
				// check valid image type under 10MB
				// check the dimensions
				let _URL = window.URL || window.webkitURL;
				let img = new Image(); /* global Image */
				img.src = _URL.createObjectURL(file);
				img.onload = function () {
					if (img.width > 5000 || img.height > 5000) {
						window.alert('Your images need to be less than 5000 pixels in height and width.'); // display alert
					} else {
						// valid image so upload to server
						// uploadImage will be your function to upload the image to the server or s3 bucket somewhere
						uploadImage(file)
							.then(async function (response) {
								const body = await response.json();
								let image = new Image();
								image.src = body.url;

								image.onload = function () {
									// place the now uploaded image in the editor where it was dropped
									const { schema } = view.state;
									const coordinates = view.posAtCoords({
										left: event.clientX,
										top: event.clientY
									}) as {
										pos: number;
										inside: number;
									};
									const node = schema.nodes.image.create({ src: body.url }); // creates the image element
									const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
									return view.dispatch(transaction);
								};
							})
							.catch(function (error) {
								if (error) {
									window.alert('There was a problem uploading your image, please try again.');
								}
							});
					}
				};
			} else {
				window.alert('Images need to be in jpg or png format and less than 10mb in size.');
			}
			return true; // handled
		}
		return false;
	}

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
