---
name: create-issue
description: Turn a feature, bug or task into a tracked work item saved as docs/issues/<slug>.md with title, description, acceptance criteria, priority and status open, then offer next steps.
argument-hint: "<title>" "<short description>"
disable-model-invocation: true
allowed-tools: Glob, Write
---

# Create issue

Save one work item as a Markdown file in `docs/issues/`. The arguments are: **$ARGUMENTS**

## 1. Read the input

- **Title:** the first argument. If it's quoted, the title is the quoted text. If nothing is
  quoted, use the arguments up to the first colon or line break.
- **Description:** the rest of the arguments.
- If there is no title, ask for a title and a short description in one plain sentence, then stop
  and wait for the answer.
- If this conversation already contains a feature spec with the same title, for example from
  `/interview-requirements`, use it as the source. Take the description from its user story, and
  take its acceptance criteria and priority as they are. Keep its edge cases, out-of-scope items
  and open questions too (see step 3).

## 2. Make the slug

Make the slug from the title: lowercase it, turn every run of characters that aren't `a-z` or
`0-9` into a single hyphen, and trim hyphens from both ends. For example, "Dark Mode Toggle!"
becomes `dark-mode-toggle`, and "Like & Retweet" becomes `like-retweet`.

Use Glob to check whether `docs/issues/<slug>.md` already exists. **Never overwrite an issue.** If
the file exists, try `<slug>-2`, then `<slug>-3`, and so on, until you find a free name.

## 3. Write the file

Write `docs/issues/<slug>.md` with the Write tool, which creates `docs/issues/` if it's missing.
Use this format:

```markdown
---
title: <title>
priority: <low | medium | high>
status: open
---

# <title>

## Description

<description>

## Acceptance criteria

- [ ] <observable, pass/fail behaviour>
```

- **Priority** must be `low`, `medium` or `high`. Map the wording you were given: "must-have",
  "urgent" or "build first" mean `high`, "nice-to-have" means `medium`, and "later" means `low`.
  If no priority was given, use `medium` and say so when you report the result.
- **Acceptance criteria:** use the criteria you were given. If there are none, write 2-4 criteria
  that follow directly from the description. Each one must describe what a user can see or do, not
  how it's built, and you must say that you wrote them.
- If the source spec has edge cases, out-of-scope items or open questions, add them after the
  acceptance criteria under `## Edge cases`, `## Out of scope` and `## Open questions`. Don't add
  those headings when there's nothing to put under them.
- Don't implement anything, and don't touch any other file.

## 4. Report and offer next steps

End your reply with exactly this block. Say any priority or criteria you filled in yourself in one
line before it.

```
Created docs/issues/<slug>.md

Next steps:
- Implement the issue we just created → docs/issues/<slug>.md
- Create another issue
```
