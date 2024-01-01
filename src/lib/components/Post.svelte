<script lang="ts">
	import Document from '@tiptap/extension-document';
	import Placeholder from '@tiptap/extension-placeholder';
	import StarterKit from '@tiptap/starter-kit';
	import { Image as TipTapImage } from '@tiptap/extension-image';
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import type { EditorView } from 'prosemirror-view';
	import type { Slice } from 'prosemirror-model';
	import { SlashMenu } from '$lib/plugins/slash';

	export let editable: boolean = true;
	export let content: string = '';
	export let id: string = '';

	const editing: boolean = id === '' && editable ? false : true;

	let element: Element;
	let editor: Editor;

	const handleSendPost = () => {
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
		const content = editor.getHTML();
		const title = getTitle();

		if (editing) {
			fetch(`/api/posts/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ title, content, image })
			})
				.then((res) => res.json())
				.then((data) => {
					window.location.href = `/posts/${data.id}`;
				})
				.catch((err) => console.log(err));
		} else {
			fetch('/api/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ title, content, image })
			})
				.then((res) => res.json())
				.then((data) => {
					window.location.href = `/posts/${data.id}`;
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
					class: 'prose justify-self-center focus:outline-none max-w-[1024px]'
				}
			},
			extensions: [
				SlashMenu,
				TipTapImage,
				CustomDocument,
				StarterKit.configure({
					document: false
				})
			],
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});

		editor.setEditable(editable);
	});
</script>

{#if editor && editable}
	<div>
		<div class="mx-4">
			<!-- <button
				on:click={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				class="btn-primary btn {editor.isActive('bold') ? 'variant-ringed-primary' : ''}"
			>
				bold
			</button>
			<button
				on:click={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				class="btn-primary btn {editor.isActive('italic') ? 'variant-ringed-primary' : ''}"
			>
				italic
			</button>
			<button
				on:click={() => editor.chain().focus().toggleStrike().run()}
				disabled={!editor.can().chain().focus().toggleStrike().run()}
				class="btn-primary btn {editor.isActive('strike') ? 'variant-ringed-primary' : ''}"
			>
				strike
			</button>
			<button
				on:click={() => editor.chain().focus().toggleCode().run()}
				disabled={!editor.can().chain().focus().toggleCode().run()}
				class="btn-primary btn {editor.isActive('code') ? 'variant-ringed-primary' : ''}"
			>
				code
			</button>
			<button class="btn-primary btn" on:click={() => editor.chain().focus().unsetAllMarks().run()}>
				clear marks
			</button>
			<button class="btn-primary btn" on:click={() => editor.chain().focus().clearNodes().run()}>
				clear nodes
			</button>
			<button
				on:click={() => editor.chain().focus().setParagraph().run()}
				class="btn-primary btn {editor.isActive('paragraph') ? 'variant-ringed-primary' : ''}"
			>
				paragraph
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				class="btn-primary btn {editor.isActive('heading', { level: 1 })
					? 'variant-ringed-primary'
					: ''}"
			>
				h1
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				class="btn-primary btn {editor.isActive('heading', { level: 2 })
					? 'variant-ringed-primary'
					: ''}"
			>
				h2
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				class="btn-primary btn {editor.isActive('heading', { level: 3 })
					? 'variant-ringed-primary'
					: ''}"
			>
				h3
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				class="btn-primary btn {editor.isActive('heading', { level: 4 })
					? 'variant-ringed-primary'
					: ''}"
			>
				h4
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
				class="btn-primary btn {editor.isActive('heading', { level: 5 })
					? 'variant-ringed-primary'
					: ''}"
			>
				h5
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
				class="btn-primary btn {editor.isActive('heading', { level: 6 })
					? 'variant-ringed-primary'
					: ''}"
			>
				h6
			</button>
			<button
				on:click={() => editor.chain().focus().toggleBulletList().run()}
				class="btn-primary btn {editor.isActive('bulletList') ? 'variant-ringed-primary' : ''}"
			>
				bullet list
			</button>
			<button
				on:click={() => editor.chain().focus().toggleOrderedList().run()}
				class="btn-primary btn {editor.isActive('orderedList') ? 'variant-ringed-primary' : ''}"
			>
				ordered list
			</button>
			<button
				on:click={() => editor.chain().focus().toggleCodeBlock().run()}
				class="btn-primary btn {editor.isActive('codeBlock') ? 'variant-ringed-primary' : ''}"
			>
				code block
			</button>
			<button
				on:click={() => editor.chain().focus().toggleBlockquote().run()}
				class="btn-primary btn {editor.isActive('blockquote') ? 'variant-ringed-primary' : ''}"
			>
				blockquote
			</button>
			<button
				on:click={() => editor.chain().focus().setHorizontalRule().run()}
				class="btn-primary btn"
			>
				horizontal rule
			</button>
			<button on:click={() => editor.chain().focus().setHardBreak().run()} class="btn-primary btn">
				hard break
			</button>
			<button
				on:click={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().chain().focus().undo().run()}
				class="btn-primary btn"
			>
				undo
			</button>
			<button
				on:click={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().chain().focus().redo().run()}
				class="btn-primary btn"
			>
				redo
			</button> -->
			<button
				on:click={() => handleSendPost()}
				disabled={!editor.can().chain().focus().undo().run()}
				class="btn-primary btn"
			>
				save post
			</button>
		</div>
	</div>
{/if}

<div class="mx-12 grid" bind:this={element} />

<!-- <style>
	:global(.tiptap img) {
		max-width: 1024px;
	}
</style> -->
