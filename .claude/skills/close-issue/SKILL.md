---
name: close-issue
description: Mark a tracked work item in docs/issues/ as done, matched by slug or part of its title, adding a short resolution note and an optional commit reference, then summarize which issues are still open.
argument-hint: <slug or title words> ["resolution note"] [commit]
disable-model-invocation: true
allowed-tools: Glob, Grep, Read, Edit
---

# Close issue

Mark one issue in `docs/issues/` as done. The arguments are: **$ARGUMENTS**

## 1. Read the input

- **Issue:** the first argument, either a slug (`dark-mode-toggle`) or some words from the title
  (`"dark mode"`). If it's quoted, use the quoted text.
- **Commit reference:** an argument that is a 7-40 character hex hash (`7c49483`), with or without
  a `commit` prefix. Only add one if the user gave one. Never look it up yourself.
- **Resolution note:** the rest of the arguments. If there isn't one, write one short sentence
  based on what this conversation shows was done, and say that you wrote it. If the conversation
  doesn't show it either, use "Marked as done.".
- If there are no arguments at all, go straight to step 2 and list the open issues as candidates.

## 2. Find exactly one issue

Look through `docs/issues/*.md` with Glob and Grep:

1. If a file's name without `.md` is exactly the argument, that's the match.
2. Otherwise, match the argument case-insensitively against each file's name and its `title:`
   line. Every file that contains the argument is a candidate.

If there is **exactly one** match, continue. If there are **none or several**, don't guess and
don't edit anything. List the candidates (for no match, list every open issue) as
`<slug> — <title> (<status>)` and ask which one is meant. Then stop and wait for the answer.

## 3. Update the file

Read the file first. If its status is already `done`, say so, change nothing, and skip to step 4.

Otherwise make two edits with Edit:

1. In the header block, change `status: open` to `status: done`. Leave every other line as it is.
2. At the end of the file, add:

   ```markdown

   ## Resolution

   <resolution note>

   Commit: <commit reference>
   ```

   Leave out the `Commit:` line if no commit reference was given.

Don't change any other part of the file or any other file.

## 4. Report

Use Grep to find the files in `docs/issues/` that still have `status: open`. Then end your reply
with this block:

```
Closed docs/issues/<slug>.md

Still open:
- <slug> — <title> (<priority>)
```

If nothing is open, write `Still open: none` instead of the list.
