## Getting Started

Follow the steps below to set up and run the project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone [repository-url]

2. **Navigate to the project directory:**
   ```bash
   cd [project-directory]

3. **Install dependencies:**
   ```bash
   npm install

4. **Run the application:**
   ```bash
   npm start

## Branching and Release Strategy

### Git-flow Guidelines
- Follow the standard Git-flow for development.
- **Do not commit directly to the main branch.**
- Always create feature branches for new development.

### Feature Branch Naming Convention
- Feature branches should follow the format: `<name>/<brief-description>`.
  For example: `rushi/create-docker-files`.

### Commit Guidelines
- Commits should be relevant to the task you are working on.
  For example: "Created Dockerfile for containerization".

### Release Branching
- Release branches should be created from the main branch in this format: `release/vX.X`.
  For example: `release/v1.0`.

### Release Versioning and Tagging
- Release versions should be created from the release branch with tags in this format: `vX.X.X`.
  For example: `v1.0.0`.

### Hotfix Strategy
- If there are hotfixes for a particular release, commit to the release branch.
- Cherry-pick the hotfix commit to the main branch.
- Create a new release and tag from the release branch in this format: `vX.X.X`.
  For example: `v1.0.1`.

## Pull Request Strategy

- **Do not commit directly to the main branch.**
- Create feature branches for all development.
- When creating a Pull Request, add just a Brief Description in title.
  For example: `Create Docker File`.
- A Pull Request should be reviewed by at least one individual before merging into the main branch.

