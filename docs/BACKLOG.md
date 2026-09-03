# Inkwell Product Backlog

Definition of Done: see README.md

| ID | User Story | Priority | Points | Status | Notes |
|----|------------|----------|--------|--------|-------|
| US-01 | As a visitor, I want to register an account, so that I can publish and interact with content | High | 3 | Requirements Defined | See requirements/use-cases.md |
| US-02 | As a registered user, I want to log in and stay logged in securely, so that I don't have to re-authenticate constantly | High | 5 | Requirements Defined | See requirements/use-cases.md |
| US-03 | As an author, I want to write and publish a post, so that readers can see my writing | High | 5 | Requirements Defined | Scope negotiated: plain text only, see Workshop 3 Section 1.4 |
| US-04 | As a reader, I want to browse a public feed of posts, so that I can discover new writing | High | 3 | Requirements Defined | See requirements/use-cases.md |
| US-05 | As a reader, I want to comment on a post, so that I can engage with the author | Medium | 3 | Backlog | |
| US-06 | As a reader, I want to follow an author, so that I see their new posts more prominently | Medium | 3 | Backlog | |
| US-07 | As an author, I want basic analytics on my posts, so that I understand my audience | Low | 5 | Backlog | |
| US-08 | As an author, I want to edit a post after publishing it, so that I can fix mistakes without deleting and republishing | Medium | 3 | Backlog | |
| US-09 | As a registered user, I want to reset my password via email, so that I can regain access to my account if I forget it | Medium | 5 | Backlog | |

## Estimate justifications (new stories)

- **US-08 (3 points):** Editing reuses the existing post model and editor from US-03, adding only an update route and an ownership check, so it is comparable in size to US-05.
- **US-09 (5 points):** Password reset touches security-sensitive token generation, expiry, and an email delivery dependency we don't have yet, making it as risky as the auth work in US-02.
