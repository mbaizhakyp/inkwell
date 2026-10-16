# Inkwell Defect Log

| ID | Found During | Cause Category | Description | Remediation |
|----|--------------|----------------|-------------|-------------|
| D-001 | Lecture 10 review | Compatibility | Nullish-coalescing assignment used without a documented minimum Node version | Added engines field to package.json |
| D-002 | Lecture 10 self-review | Incomplete design | Feed.jsx has no error state: a failed /api/posts fetch leaves the page on "Loading posts…" indefinitely | Open — error state to be added alongside Lecture 12 testing work |
