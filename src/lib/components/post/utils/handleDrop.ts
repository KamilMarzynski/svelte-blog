import type { EditorView } from 'prosemirror-view';
import type { Slice } from 'prosemirror-model';
import { uploadImage } from "./uploadImage";

export function handleDrop(view: EditorView, event: DragEvent, slice: Slice, moved: boolean) {
    if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0]; // the dropped file
        const filesize = (file.size / 1024 / 1024).toFixed(4); // get the filesize in MB
        if ((file.type === 'image/jpeg' || file.type === 'image/png') && filesize < '10') {
            // check valid image type under 10MB
            // check the dimensions
            const _URL = window.URL || window.webkitURL;
            const img = new Image(); /* global Image */
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
                            const image = new Image();
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