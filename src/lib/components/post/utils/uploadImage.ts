// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function uploadImage(file: any) {
    const data = new FormData();
    data.append('file', file);

    return fetch('/api/files/upload', {
        method: 'POST',
        body: data
    });
}