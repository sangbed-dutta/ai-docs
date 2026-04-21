---
name: wm-ai-create-guide
description: >
  Use this skill when creating a product guide, how-to, or tutorial for WaveMaker documentation.
  Activate when the user asks to write a guide, create a how-to doc, document a feature workflow,
  add step-by-step instructions, or document how to use a WaveMaker feature — especially when the
  user provides draft text, notes, or raw content and wants it turned into a structured guide.
---

# WaveMaker Guide Creator

You are helping a technical writer or developer turn draft content into a polished **Guide** page for the WaveMaker docs site (Docusaurus 3.x + MDX).

Guides live under `docs/guide/` and teach users how to accomplish a specific task using a WaveMaker feature. Your job is to take whatever the user gives you — draft text, bullet points, rough notes, images — and produce a clean, complete guide following WaveMaker's structure and conventions.

---

## How This Skill Works

The user provides:
- **Draft content** — any form: rough notes, bullet points, a paragraph dump, partial steps, or a mix of text and images
- **Optional media** — screenshots, GIFs, and/or an Academy video link

You generate a complete, publish-ready guide from that input.

---

## Step 1 — Understand the Input

Read whatever the user provides. Extract or infer:

- The **feature or product area** being documented
- The **task goal** — what the user will be able to do after following the guide
- The **logical steps** — reorder, split, or merge draft steps as needed for clarity
- The **target audience** — infer from tone and complexity; default to intermediate

If the draft is too thin to generate a complete guide (e.g., just a title with no steps), ask one focused follow-up question to get the missing core content. Do not ask multiple questions at once.

---

## Step 2 — Review the Draft and Ask Targeted Questions (one ask, all at once)

Before generating, compare the draft against the guide template and identify gaps. Then send **one single message** that:

1. Briefly confirms what you understood from the draft (feature, goal, rough steps)
2. Calls out specifically what is missing or too thin to produce great content
3. Asks for optional enrichments

Frame everything as helping the user produce a great guide, not as a checklist. Be specific — don't ask vague questions.

**Gap checks to run on the draft:**

| What to check | What to ask if missing or weak |
|---|---|
| Prerequisites | "I don't see any prerequisites mentioned — are there setup steps or prior knowledge the user needs before starting?" |
| Steps detail | "Step X feels too high-level — can you add more detail so I can break it into specific actions?" |
| Target audience | "Who is this for? A first-time WaveMaker user or someone already familiar with the product?" |
| Edge cases / gotchas | "Are there any common mistakes or tricky parts in this flow that users should watch out for?" |
| Limitations | "Does this feature have any known limitations — e.g., not available in certain tiers, versions, or project types?" |
| See Also candidates | "Are there related guides or docs I should link to at the end?" |
| Author name | "Who should be credited as the author in the doc frontmatter?" |
| Screenshots / GIFs | "Do you have any screenshots or GIFs to include? If yes, share them and tell me which step each belongs to." |
| Academy video | "Do you have a video for this on Academy (`academy.wavemaker.ai`)? If yes, share the URL and I'll embed it." |

Only ask about gaps that are actually missing — do not ask about something already covered in the draft. If the draft is comprehensive, the message can be short.

**Example prompt format:**

> Here's what I've got from your draft: [brief summary].
>
> To make this guide really shine, a few things would help:
> - [Specific gap 1 with targeted question]
> - [Specific gap 2 with targeted question]
>
> Also, a few optional additions:
> - Screenshots or GIFs? Share them and tell me which step they go with.
> - Academy video URL? I'll add a VideoCard for it.
>
> Answer what you can — I'll generate the guide right after.

Do not ask again after the user responds. Proceed immediately to generation.

---

## Step 3 — Generate the Guide

Use the template at `assets/guide-template.md` as your base. Produce a complete `.md` file with no leftover placeholder text.

### Frontmatter
```yaml
---
title: "{{Verb-first title derived from the draft}}"
id: "{{filename-without-extension}}"
sidebar_label: "{{Short label if title is long}}"
last_update: { author: "{{Author name, or omit field if not provided}}" }
---
```

### Structure (follow this order)

1. **Overview** — 2–3 sentences, outcome-focused, second-person
2. **Academy VideoCard** — only if the user provided an Academy URL (see format below); omit entirely otherwise
3. **Prerequisites** — bulleted; link to related docs where relevant
4. **Steps** — one H2 per major phase, numbered steps within each; atomic, second-person
5. **Limitations and Constraints** — only if the user provided limitation info or the feature has obvious scope boundaries; omit if not applicable
6. **See Also** — 2–5 relative links to related docs

### Writing Rules

- Second-person throughout ("you", "your")
- One action per numbered step
- Use `:::note`, `:::tip`, `:::warning` admonitions where they add genuine value — not decoratively
- Include code blocks for any config, code, or script content

---

## Media Handling

### Screenshots & GIFs (optional)

- All media is optional. Only include what the user provides.
- Place media immediately after the step or phase it illustrates.
- Use a screenshot (`.png`) for static UI states; use a GIF (`.gif`) for flows or interactions.
- Store all media in `./images/` relative to the doc file.
- Format: `![Clear description of what is shown](./images/filename.png)`
- If the user mentions they'll add a screenshot later, insert a one-line comment as a reminder:
  ```
  {/* TODO: Add screenshot — [describe what to capture] */}
  ```
- **No inline videos.** If the user wants to include a video walkthrough, tell them:
  > Upload the video to [WaveMaker Academy](https://academy.wavemaker.ai) first, then share the Academy URL and I'll add a VideoCard for it.

### Academy Video (optional)

If the user provides an Academy URL, add this block immediately after the Overview section:

```mdx
<VideoCard
  videoUrl="https://academy.wavemaker.ai/Watch?wm={{VIDEO_ID}}"
  title="{{Video title}}"
  description="{{One sentence describing what the video demonstrates.}}"
  thumbnailText="{{Short label shown on thumbnail}}"
/>
```

Omit the block entirely if no Academy URL is provided.

---

## Content Standards

| Element | Standard |
|---|---|
| Title | Verb-first, task-oriented (e.g., "Add a Login Page") |
| Overview | 2–3 sentences, outcome-focused |
| Prerequisites | Bulleted list; link to related docs |
| Steps | H2 per phase; numbered, atomic steps |
| Media | Optional; placed after the relevant step/phase |
| Limitations | Optional section; only include if there's real content |
| Academy Video | Optional `<VideoCard>` after Overview |
| See Also | 2–5 relative markdown links |

---

## Naming Conventions

- **File**: `docs/guide/<subfolder>/<feature-task-name>.md`
- **id**: filename without `.md`
- **title**: human-readable, title case, verb-first

### Subfolders under `docs/guide/`

| Subfolder | Use for |
|---|---|
| `components/` | Widget or UI component how-tos |
| `deployment/` | Build, deploy, publish guides |
| `security/` | Security-related guides |
| `App Solutions/` | Application-specific solutions and use cases |
| `Layouting & Styling/` | Layout and styling guides |
| `Variables/` | Variable-related guides |
| *(new subfolder)* | Create one if no existing folder fits — use lowercase, hyphenated |
