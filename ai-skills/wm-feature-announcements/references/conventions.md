# Feature Announcement Conventions

## Where this lives in the site

Feature announcements are powered by a **separate Docusaurus blog plugin instance** (not the main blog), configured in `docusaurus.config.js`:

```js
{
  id: 'feature-announcements',
  routeBasePath: 'feature-announcements',
  path: 'blogs/feature-announcements',
  authorsMapPath: '../../data/author/authors.yml',
}
```

Meaning:

- Source files live in `blogs/feature-announcements/`.
- Published URL is `/feature-announcements/<slug>`.
- Authors are shared with the main blog via `data/author/authors.yml`.
- Tags are **local** to feature announcements: `blogs/feature-announcements/tags.yml`.

## Filename format

```
blogs/feature-announcements/YYYY-MM-DD-<slug>.mdx
```

Docusaurus derives the post date from the filename prefix. Keep the slug kebab-case and descriptive but short (≤ 6 words).

## Frontmatter fields

| Field     | Required | Notes                                                                                |
| --------- | -------- | ------------------------------------------------------------------------------------ |
| `title`   | yes      | Product-facing title. Sentence case.                                                 |
| `authors` | yes      | Array of keys from `data/author/authors.yml`. Use the **key**, not the display name. |
| `tags`    | yes      | Array of keys from `blogs/feature-announcements/tags.yml`.                           |
| `image`   | no       | Relative path to hero/social card image.                                             |

## Authors

Check `data/author/authors.yml` before referencing an author. Example entry:

```yaml
SagarV:
  name: Sagar Vemala
  title: Engineering Manager at WaveMaker
  url: https://github.com/wm-sagarvemala
  image_url: https://github.com/wm-sagarvemala.png
  page: true
  socials:
    github: wm-sagarvemala
    linkedin: sagar-vemala-2b3b6214
```

Reference as `authors: [SagarV]`.

If the author does not exist, ask the user whether to add them. Do not invent an entry.

## Tags

Tags live in `blogs/feature-announcements/tags.yml`. Structure:

```yaml
<tag-key>:
  label: <Display Label>
  permalink: /<tag-key>
  description: <One-line description>
```

Reference as `tags: [<tag-key>]`. The current file contains placeholder tags — verify with the user before reusing them.

## Image placement

Two valid locations exist in this repo; for feature announcements, prefer **co-located**:

- **Preferred (co-located):** `blogs/feature-announcements/assets/images/<slug>/<image>.png`, referenced with relative paths (`./assets/images/<slug>/hero.png`).
- Avoid `static/img/` for announcement-specific images — that directory is for globally shared assets.

Always include descriptive `alt` text.

## Truncation

Every post must include a `{/* truncate */}` marker. Content above the marker appears on the listing page; content below appears only on the individual post page.

In `.md` files the equivalent marker is `<!--truncate-->`, but **announcements and blogs in this repo are `.mdx`**. In MDX, HTML comments are not valid syntax — MDX treats `<` as the start of a JSX element and the build fails. Always use the JSX-expression form `{/* ... */}` for both the truncate marker and any other comment.

## Academy and video content

Two globally-registered MDX components are available in any `.mdx` file under `blogs/` or `docs/`. They are wired in `src/theme/MDXComponents/index.js` — **do not import them**; doing so causes redeclaration errors.

### `<AcademyCard>` — interactive walkthroughs

```mdx
<AcademyCard
  title="Styling with Design Tokens"
  description="Walkthrough on applying and overriding design tokens in Studio."
  academyLink="https://academy.wavemaker.ai/Walkthrough?wm=44FAE42ED5"
/>
```

Props: `title`, `description`, `academyLink`. Optional children render inside the card body.

### `<VideoCard>` — Academy video

```mdx
<VideoCard
  videoUrl="https://academy.wavemaker.ai/Watch?wm=55311449F7"
  title="Create a Page in WaveMaker"
  description="Step-by-step walkthrough of page creation and management in Studio."
  thumbnailText="Create Page"
/>
```

Props: `videoUrl`, `title`, `description`, `thumbnailText` (optional), `thumbnailSrc` (optional override).

### Compact inline form

For passing mentions where a full card is overkill:

```mdx
▶️ [Custom Repository Configuration](https://academy.wavemaker.ai/Walkthrough?wm=F10915CB96)
```

### URL shapes

- Walkthroughs: `https://academy.wavemaker.ai/Walkthrough?wm=<ID>`
- Videos: `https://academy.wavemaker.ai/Watch?wm=<ID>`

The `wm=<ID>` identifier is generated when content is published on Academy. Always get the exact URL from the user — never fabricate or guess it.

## Build-time guarantees

The site enforces:

- `onBrokenLinks: 'throw'`
- `onBrokenMarkdownLinks: 'throw'`
- `onBrokenMarkdownImages: 'throw'`
- `mdxlint --frail` via `npm run lint`

Run `npm run lint` and `npm run build` before declaring an announcement done. Both must pass.

## Linking out

Feature announcements are served by a **separate Docusaurus blog plugin instance**. They do not participate in the docs plugin's relative-MDX link resolver. As a result, the link style differs from what works inside `docs/`.

### The three rules

| From → To                            | Pattern                        | Example                                                                                            |
| ------------------------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| Doc → Doc (both under `docs/`)       | Filesystem-relative MDX path   | `[tokens](../../user-interfaces/web/develop/styling-with-design-tokens/design-token-architecture)` |
| Announcement/Blog → Doc              | URL path (no `.mdx` extension) | `[tokens](/docs/user-interfaces/web/develop/styling-with-design-tokens/design-token-architecture)` |
| Anywhere → Blog post or Announcement | URL with date segments         | `[post](/blog/2026/04/09/AI-Native-Developer-Intelligence-at-scale)`                               |

### Why the relative form fails from here

Relative `.mdx` link resolution is a feature of the docs plugin — it resolves paths against the current file's location within the `docs/` tree. Blog and feature-announcement plugin instances have their own content roots and do not share this resolver. A path like `../../user-interfaces/web/...` from `blogs/feature-announcements/...` is meaningless to Docusaurus, and with `onBrokenLinks: 'throw'` enabled, the build fails.

### Date segments are always required

Any file whose name begins with `YYYY-MM-DD-` (all blog posts and feature announcements) has its date split into URL path segments by Docusaurus. The file `blogs/feature-announcements/2026-04-21-ask-ai-in-docs.mdx` is published at `/feature-announcements/2026/04/21/ask-ai-in-docs`. Link to it exactly that way — do not use the filename or drop the date.

### Images across plugins

Filesystem-relative image paths (`../../docs/.../foo.png`) do resolve, because images are served as static assets and do not go through the MDX link resolver. Even so, prefer co-located images per-post — duplicating or re-referencing an image from another plugin's tree is a maintenance trap.

## Difference from adjacent surfaces

| Surface                                         | Use when                                               |
| ----------------------------------------------- | ------------------------------------------------------ |
| Feature announcement (`/feature-announcements`) | Short, public-facing "we shipped X" notice.            |
| Blog post (`/blog`)                             | Longer narrative, engineering story, or thought piece. |
| Release notes (`/docs/release-notes/`)          | Versioned, comprehensive list of changes in a release. |
| Docs page (`/docs/...`)                         | Reference, how-to, or conceptual documentation.        |

A single launch often produces entries on multiple surfaces; each links to the others.
