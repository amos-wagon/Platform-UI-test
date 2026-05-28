# Figma Design Token Sync Setup

This repository is configured to automatically sync design tokens from Figma using GitHub Actions.

## Setup Instructions

### Step 1: GitHub Repository Secrets
Add the following secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):

- `FIGMA_ACCESS_TOKEN`: Your Figma personal access token
  - Get this from [Figma Settings > Personal Access Tokens](https://www.figma.com/settings)
- `FIGMA_FILE_KEY`: Your Figma file key
  - Found in the Figma file URL: `https://figma.com/design/[FILE_KEY]/...`

### Step 2: Repository Permissions
Enable GitHub Actions to commit and push changes:

1. Go to **Settings > Actions > General** in your repository
2. Under "Workflow permissions", select **"Read and write permissions"**
3. Check **"Allow GitHub Actions to create and approve pull requests"**
4. Click **Save**

### Step 3: Figma File Setup
Ensure your Figma file has:
- Design variables/tokens properly named
- Variables organized in collections for colors, spacing, typography, etc.

## How It Works

1. **Scheduled Sync**: Runs daily at midnight UTC
2. **Manual Trigger**: Can be triggered manually from the Actions tab
3. **Token Extraction**: Fetches variables from Figma using the Variables API
4. **Transformation**: Converts Figma variables to Style Dictionary format
5. **Build**: Generates CSS custom properties in `build/css/variables.css`
6. **Commit**: Automatically commits and pushes changes

## File Structure

```
├── .github/workflows/figma-sync.yml    # GitHub Actions workflow
├── scripts/fetch-figma-tokens.js       # Figma API integration
├── config.json                         # Style Dictionary configuration
├── tokens/                             # Generated token files
│   ├── colors.json
│   ├── spacing.json
│   └── ...
└── build/css/variables.css             # Generated CSS variables
```

## Usage

Import the generated CSS variables in your project:

```css
@import 'build/css/variables.css';

.my-component {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
}
```