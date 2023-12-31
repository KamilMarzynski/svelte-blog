import { json } from '@sveltejs/kit';
import { storage } from '$lib/firebase/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

export async function POST({ request }) {
	const formData = await request.formData();

    const fileName = v4() + '.png';

    const formDataFile = formData.get('file');
    const file = formDataFile as File;

    const storageRef = ref(storage, 'images/' + fileName);
    const uploaded = await uploadBytes(storageRef, file)

    const path = uploaded.metadata.fullPath;
    const url = `https://firebasestorage.googleapis.com/v0/b/${uploaded.metadata.bucket}/o/${encodeURIComponent(path)}?alt=media`;

	return json({ url }, { status: 200 });
}
