---
name: wm-ai-create-guide
description: >
  Use this skill when creating a product guide, how-to, or tutorial for WaveMaker documentation.
  Activate when the user asks to write a guide, create a how-to doc, document a feature workflow,
  add step-by-step instructions, or document how to use a WaveMaker feature. This skill provides
  the structure, frontmatter conventions, and content standards for a WaveMaker Guide page.
---

# WaveMaker Guide Creator

You are helping a technical writer or developer create a **Guide** page for the WaveMaker docs site (Docusaurus 3.x + MDX).

Guides are how-to / tutorial docs that teach users how to accomplish a specific task using a WaveMaker product feature. They live under `docs/guide/` and follow a consistent structure.

---

## Before You Start

Ask the user for the following if not already provided:

1. **Feature name** — what WaveMaker feature or product area does this guide cover?
2. **Task goal** — what will the user accomplish by following this guide?
3. **Target audience** — beginner, intermediate, or advanced WaveMaker user?
4. **Prerequisites** — any prior setup, features, or knowledge required?
5. **Steps** — the high-level actions the user will take (you can infer these and confirm)
6. **Author name** — for the `last_update` frontmatter field

---

## Output Instructions

1. Use the template at `templates/guide-template.md` as your base structure.
2. Fill in every section — do not leave placeholder text in the final output.
3. Follow WaveMaker docs conventions:
   - Frontmatter: `title`, `id`, `sidebar_label` (if different from title), `last_update` with `{ author: "Name" }`
   - File name: lowercase, hyphenated, descriptive (e.g., `configure-data-binding.md`)
   - Folder: place under the most relevant subfolder inside `docs/guide/`
4. Use **second-person** ("you", "your") throughout.
5. Keep steps **numbered and atomic** — one action per step.
6. Add a **:::note**, **:::tip**, or **:::warning** admonition wherever it adds value.
7. Include a code block if any code, config, or script is involved.
8. End with a **"See Also"** section linking to related docs using relative paths.

---

## Content Standards

| Element | Requirement |
|---|---|
| Title | Verb-first, task-oriented (e.g., "Add a Login Page") |
| Overview | 2–3 sentences: what the guide does and why it matters |
| Prerequisites | Bulleted list; link to setup docs when relevant |
| Steps | H3 headings per major phase; numbered steps within each |
| Screenshots | Note where screenshots should be inserted as `![alt](./path-to-image.png)` |
| Notes/Tips | Use Docusaurus admonitions (`:::note`, `:::tip`, `:::warning`) |
| See Also | 2–5 related links using relative markdown paths |

---

## Naming Conventions

- **File**: `docs/guide/<subfolder>/<feature-task-name>.md`
- **id**: same as filename without `.md`
- **title**: human-readable, title case, verb-first

### Subfolders under `docs/guide/`

| Subfolder | Use for |
|---|---|
| `components/` | Widget or UI component how-tos |
| `deployment/` | Build, deploy, publish guides |
| `migrated-docs/` | Guides migrated from legacy docs |
| *(new subfolder)* | Create one if no existing folder fits — use lowercase, hyphenated |

---

## Example

**User says:** "Write a guide on how to add master-detail records using a Data Table."

**You produce:** A complete `.md` file using the template, filled in with accurate steps, a prerequisites section, admonitions where helpful, and a See Also section.
