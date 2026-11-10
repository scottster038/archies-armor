# archies-armor
Source code for Archie's donation website, hosted on GitHub Pages.

No build step: plain HTML/CSS/JS. Open `index.html` in a browser to preview.

## Where to edit
| What | File |
|---|---|
| Story, CACNA1A text, roadmap text | `index.html` (look for `TODO` and `[bracketed]` placeholders) |
| Donation link, fundraising goal/raised/supporters, contact email | `SITE` settings at the top of `script.js` (stats stay hidden until filled in) |
| Treatment roadmap progress | in `index.html`, change each step's class to `done`, `current` or `next` |
| Family updates | copy an `<article>` block in the Updates section of `index.html` |
| Colors and fonts | variables at the top of `styles.css` |
| Logo (vector) | `assets/archies-armor-logo.svg` (also inlined in the hero of `index.html`) |
| Browser tab icon | `assets/favicon.svg` |
| Photos | put them in an `images/` folder and swap out the `.photo-placeholder` div |

## Custom domain
When you buy a domain, add it under **Settings → Pages → Custom domain** (GitHub creates a `CNAME` file),
then update the `og:url` / `og:image` URLs in `index.html`.
