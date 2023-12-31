<script lang="ts">
	import Document from '@tiptap/extension-document';
	import Placeholder from '@tiptap/extension-placeholder';
	import StarterKit from '@tiptap/starter-kit';
	import { Image as TipTapImage } from '@tiptap/extension-image';
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import type { EditorView } from 'prosemirror-view';
	import type { Slice } from 'prosemirror-model';

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
			const image = images ? images[1] : '/static/images/placeholder.png';
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
								console.log(body.url);
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
				handleDrop
			},
			extensions: [
				TipTapImage,
				// Dropcursor,
				CustomDocument,
				StarterKit.configure({
					document: false
				}),
				Placeholder.configure({
					placeholder: ({ node }) => {
						if (node.type.name === 'heading') {
							return 'Add title to your post...';
						}
						return '';
					}
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
		<div>
			<button
				on:click={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				class={editor.isActive('bold') ? 'is-active' : ''}
			>
				bold
			</button>
			<button
				on:click={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				class={editor.isActive('italic') ? 'is-active' : ''}
			>
				italic
			</button>
			<button
				on:click={() => editor.chain().focus().toggleStrike().run()}
				disabled={!editor.can().chain().focus().toggleStrike().run()}
				class={editor.isActive('strike') ? 'is-active' : ''}
			>
				strike
			</button>
			<button
				on:click={() => editor.chain().focus().toggleCode().run()}
				disabled={!editor.can().chain().focus().toggleCode().run()}
				class={editor.isActive('code') ? 'is-active' : ''}
			>
				code
			</button>
			<button on:click={() => editor.chain().focus().unsetAllMarks().run()}> clear marks </button>
			<button on:click={() => editor.chain().focus().clearNodes().run()}> clear nodes </button>
			<button
				on:click={() => editor.chain().focus().setParagraph().run()}
				class={editor.isActive('paragraph') ? 'is-active' : ''}
			>
				paragraph
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				class={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
			>
				h1
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				class={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
			>
				h2
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				class={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
			>
				h3
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				class={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
			>
				h4
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
				class={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
			>
				h5
			</button>
			<button
				on:click={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
				class={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
			>
				h6
			</button>
			<button
				on:click={() => editor.chain().focus().toggleBulletList().run()}
				class={editor.isActive('bulletList') ? 'is-active' : ''}
			>
				bullet list
			</button>
			<button
				on:click={() => editor.chain().focus().toggleOrderedList().run()}
				class={editor.isActive('orderedList') ? 'is-active' : ''}
			>
				ordered list
			</button>
			<button
				on:click={() => editor.chain().focus().toggleCodeBlock().run()}
				class={editor.isActive('codeBlock') ? 'is-active' : ''}
			>
				code block
			</button>
			<button
				on:click={() => editor.chain().focus().toggleBlockquote().run()}
				class={editor.isActive('blockquote') ? 'is-active' : ''}
			>
				blockquote
			</button>
			<button on:click={() => editor.chain().focus().setHorizontalRule().run()}>
				horizontal rule
			</button>
			<button on:click={() => editor.chain().focus().setHardBreak().run()}> hard break </button>
			<button
				on:click={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().chain().focus().undo().run()}
			>
				undo
			</button>
			<button
				on:click={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().chain().focus().redo().run()}
			>
				redo
			</button>
			<button
				on:click={() => handleSendPost()}
				disabled={!editor.can().chain().focus().undo().run()}
			>
				Save post
			</button>
		</div>
	</div>
{/if}

<div class="editor-container" bind:this={element} />

<style>
	.editor-container {
		width: 75%;
	}

	:global(.ProseMirror) {
		outline: 0;
		border: none;
	}

	:global(.ProseMirror[contenteditable='false']) {
		background-color: white;
		color: black;
	}

	:global(.ProseMirror[contenteditable='false'] *:not(img)) {
		pointer-events: none;
	}

	:global(.tiptap .is-empty::before) {
		content: attr(data-placeholder);
		float: left;
		color: #ced4da;
		pointer-events: none;
		height: 0;
	}
</style>
