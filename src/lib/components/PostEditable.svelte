<script lang="ts">
    export let title: string = '';
    export let content: string = '';
    export let slug: string = '';
    const editing: boolean = slug === '' ? false : true;

    const action = editing ? '?/update' : '?/create';
</script>


<form method="POST" action={action}>
    <input type="hidden" name="slug" value={slug} />
    <label>Title 
        <textarea name="title" value={title} required/> 
    </label>
    
    <label>Content
        <textarea name="content" value={content} required></textarea> 
    </label>
    
    <button>{editing ? 'Edit' : 'Create'}</button>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        max-width: 500px;
        margin: 0 auto;
    }
    form label {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
    }
    form label input, form label textarea {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
    }
    form label input:focus, form label textarea:focus {
        outline: none;
        border-color: #333;
    }
    form label input {
        height: 2rem;
    }
    form label textarea {
        min-height: 10rem;
    }
    form button {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        background-color: #eee;
        cursor: pointer;
    }
    form button:hover {
        background-color: #ddd;
    }
    form button:active {
        background-color: #ccc;
    }
    form button:focus {
        outline: none;
        border-color: #333;
    }
</style>