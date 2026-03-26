---
name: site5-cpanel-deployment
description: Steps and rules for deploying a Vite SPA alongside pure PHP APIs to a cPanel shared hosting environment (e.g., Site5).
---
# Site5 cPanel Deployment Skill

## Context
Standard deployment to a traditional cPanel server via FTP or File Manager. The environment serves static files directly via Apache and routes API requests to PHP scripts.

## Directory Structure
The production `public_html` (or equivalent docroot) should look like this:
```
index.html       # Built by Vite
assets/          # Built by Vite
.htaccess        # Crucial for routing
api/             # Your PHP endpoints
  upload.php
  calculate.php
```

## `.htaccess` Requirements
You must include an `.htaccess` file that achieves two things:
1.  **API Routing**: Route `/api/*` requests to the physical PHP files inside the `api/` directory.
2.  **SPA Routing**: Forward all other non-existing files/directories to `index.html` so React Router can handle them.

Example Base:
```apache
Options -Indexes
DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On

  # API
  RewriteRule ^api/upload$    api/upload.php    [L]
  RewriteRule ^api/calculate$ api/calculate.php [L]

  # SPA
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
```

## Deployment Steps
1. Ensure the UI is fully built (`npm run build`).
2. Copy `dist/*` to the output folder.
3. Copy the `api/` folder and `.htaccess` file to the same output folder.
4. Deploy the combined structure to the target server.
