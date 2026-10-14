# claudiocotrufo.github.io

Personal site of Claudio Cotrufo, senior full-stack engineer and tech lead (.NET, Angular, Azure). Served by GitHub Pages at <https://claudiocotrufo.github.io>.

Plain static HTML, CSS and JavaScript, no build step.

- `index.html`: the page. Content mirrors the CV in the `claudio-cv` repository.
- `files/claudio-cotrufo-cv.pdf`: the modern CV, built from `claudio-cv` with the phone number removed.
- `assets/`: photographs from Wikimedia Commons, resized; sources and licences in `assets/credits.json` and in the page footer.

## Updating the CV PDF

In `claudio-cv`, build the modern layout with `phone = ""` in `profile.toml`, then copy `build/cv-modern.pdf` to `files/claudio-cotrufo-cv.pdf`.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.
