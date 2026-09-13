NJ Bug Ninja V13 Site Patch

What this does
- Adds a new high-resolution hero image: assets/hero-v13.webp
- Adds a new high-resolution backyard image: assets/backyard-v13.webp
- Restores the older South Jersey graphic: assets/south-jersey-v11.webp
- Updates the current CSS/HTML references
- Bumps the cache query from 12.0.0 to 13.0.0
- Commits and pushes the changes to GitHub main

How to use
1. Extract the contents of this ZIP directly into:
   C:\Users\Joshm\OneDrive\Desktop\njbugninja-live
2. Open PowerShell in that folder.
3. Run:
   powershell -ExecutionPolicy Bypass -File .\install-v13.ps1

The script checks that it is inside the Git repository before making changes.
