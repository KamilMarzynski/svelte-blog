# Svelte blog project

## About

This project it to track my humble progress in svelte app development.
In terms of editor I have used some of the code from [nextlint](https://github.com/sveltor/nextlint). Which is great package aiming to bring notion like editing to svelte. I needed just smart potion of it's capabilities not to complicate too much the flow and my page.

## Roadmap 
### Improvements

- [ ] (UX) Improve local storage blog post saving when internet connection is weak
- [ ] (UX) Better post edit button
- [ ] (UX) Further work on making editor even more user friendly
- [ ] (technical) Add proper api error handling

### Features
- [ ] User profile page
- [ ] Post drafts on profile page and post publishing
- [ ] Password reset
- [ ] Post deleting
- [ ] Post discussion (comments) functionality
- [ ] AI text review before publishing post
- [ ] Posts' categories

### Future
- Add option for user to become author and have own blog page
- Rework dashboard to show most popular author/blogs etc.
- Rework routing so that posts are always nested in authors routes


## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

## Firebase

For this app to work, first create account on firebase and create new project. 
You can find all required information [here](https://firebase.google.com/) and [here](https://firebase.google.com/docs/web/setup?continue=https%3A%2F%2Ffirebase.google.com%2Flearn%2Fpathways%2Ffirebase-web%23article-https%3A%2F%2Ffirebase.google.com%2Fdocs%2Fweb%2Fsetup)
After getting firebase config. Copy .evn.example and rename it to .env. Next fill it with your config.
You need to add to your firebase project firestore, authentication and storage. After doing so, you are good to go.