# Frontend Mentor - Interactive comments section solution

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- Upvote and downvote comments
- **Bonus**: If you're building a purely front-end project, use `localStorage` to save the current state in the browser that persists when the browser is refreshed.
- **Bonus**: Instead of using the `createdAt` strings from the `data.json` file, try using timestamps and dynamically track the time since the comment or reply was posted.

### Links

- Solution URL: [GitHub](https://takahashiyb.github.io/interactive-comment-section/)
- Live Site URL: [GitHub Pages](https://github.com/takahashiyb/interactive-comment-section)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vue JS framework
- Pinia
- Typescript
- Vitest

### What I learned

Although my challenge of practicing integration tests did not pan out well, I am very proud to have worked on CRUD in this project. It is not my first time pulling data from a database, but it is my first time updating, inserting and deleting entries.

A fourth of my time was spent trying to make the CRUD work, which took a lot of googling and asking AI. while I do understand the commands for SQL type of databases, what I had a hard time on was setting it up to be live and constantly updating. Like in Vue, I had to use a combination of Vue's watchEffect() and supabase's .on() to make sure all data and avatars show up.

### Continued development

The actual purpose of the challenge, which was to focus on the integration tests, I found, were difficult to implement or I have no clue how to work on it. Since the sequence of actions are short, they seem more like unit tests to me more than anything. So, for now, I will try to understand the concept a bit more before taking another shot at this.

For next time, since I was very unaware of what I can do and cannot with the testing tools, I hope I could plan it out a little better especially my components, so they don't have to rely on parent components to function therefore, allowing to test them in isolation.

Also, I could never figure out, how to put the name of the user you are replying to in the textarea without messing up when confirming the change or post. I took too much time on figuring out. I was wondering what others did to achieve the effect.

### Useful resources

- [Supabase](https://supabase.com/docs)
- [Vitest](https://vitest.dev/guide/)

### AI Collaboration

- Copilot - To bridge gaps in knowledge and expounding on documentations.

## Author

- Frontend Mentor - [@takahashiyb](https://www.frontendmentor.io/profile/takahashiyb)
