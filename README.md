# archies-armor
Source code for Archie's donation website, hosted on GitHub Pages.

No build step: plain HTML/CSS/JS. Open `index.html` in a browser to preview.

## Where to edit
| What | File |
|---|---|
| Story, CACNA1A text, roadmap text | `index.html` (look for `TODO` and `[bracketed]` placeholders) |
| Donation link, fundraising goal/raised/supporters, contact email | `SITE` settings at the top of `script.js` (stats stay hidden until filled in) |
| Treatment roadmap progress | in `index.html`, change each step's class to `done`, `current` or `next` |
| Family updates | add a row to the family Google Sheet (Date, Category, Title, Summary, Full update, Show). The site reads it via `updatesCsvUrl` in `script.js`. Set Show to "No" to hide a row; blank lines in "Full update" become paragraphs. |
| Colors and fonts | variables at the top of `styles.css` |
| Logo (vector) | `assets/archies-armor-logo.svg` (also inlined in the hero of `index.html`) |
| Browser tab icon | `assets/favicon.svg` |
| Photos | put them in an `images/` folder and swap out the `.photo-placeholder` div |

## Custom domain
The site is served at https://www.archiesarmor.com (domain registered at Porkbun; the `CNAME` file tells GitHub Pages which domain to use).
