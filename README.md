# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
# crafting-web

## Security configuration

The contact form uses Cloudflare Turnstile. Create a widget for `ilyaarkov.com` and `www.ilyaarkov.com`, then configure:

- `TURNSTILE_SITE_KEY` as a build environment variable. Vite explicitly exposes this public site key to the client bundle; it does not need the `VITE_` prefix.
- `TURNSTILE_SECRET_KEY` as a server-side environment variable. Do not expose this value to the browser.

Set both variables in Vercel and redeploy. The lead API rejects submissions if Turnstile is not configured or its verification fails. `.env.example` lists the variable names for local development.

The vulnerability disclosure contact is published at `/.well-known/security.txt`. Keep its contact address monitored and update its `Expires` date before it passes.

Cloudflare DNS and account recommendations are managed separately from this repository. Confirm the Vercel DNS requirements before proxying the apex and `www` records. Configure DMARC only after identifying all legitimate email senders for the domain; enabling AI Labyrinth is optional.
