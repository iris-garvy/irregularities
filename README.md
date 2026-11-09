# irregularities

The pages of https://irregularities.org, served by GitHub Pages from the `main` branch.

## Editing

Edit any page here (`<topic>/index.html`, or `style.css` and `site.js`, which every page shares), then commit and push. In VS Code: Commit, then Sync Changes. The site updates about a minute after a push. After changing `style.css` or `site.js`, reload with Cmd-Shift-R to see it.

## Rebuilds

New and updated pages arrive as commits named "Merge the new build into main". They keep your edits. If a rebuild changed the same or neighbouring lines as one of your edits, it stops and nothing changes until the clash is sorted out by hand.

- Stay on `main`, and pull by merging, not rebasing.
- Save your open files before a rebuild. If VS Code then says a file changed on disk, choose Compare, not Overwrite.
