# RED — Russian Electoral Data website

Static website for the Russian Electoral Data (RED) project.

## Local preview

```sh
cd public
/usr/bin/python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Cloudflare Pages

Connect this repository to Cloudflare Pages with these settings:

- Framework preset: `None`
- Production branch: `main`
- Build command: leave blank
- Build output directory: `public`
- Root directory: leave blank

The website is prebuilt. Cloudflare only needs to publish the contents of
`public/`; no server-side code or build step is required.

## Updating the site

The JSON files in `public/data/` are generated artifacts used directly by the
browser. Regenerate them in the RED research workspace, copy the published
versions here, preview the site locally, and then commit the update.

Source boundary files and research inputs are deliberately not included in
this deployment repository.
