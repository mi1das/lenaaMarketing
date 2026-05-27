# Obsidian as lenaa Creative Source of Truth

Use this reference when connecting or relying on Sahajit's Obsidian vault for lenaa ad-performance and creative analysis.

## Purpose

For lenaa marketing, Obsidian should hold the creative rationale and raw source material:

- ad ideas and hooks
- UGC/script drafts
- campaign briefings
- creator/persona notes
- angle/offer/CTA decisions
- learnings from winners and losers

Meta/MCP tools remain the performance source of truth. Obsidian explains the creative intent behind the numbers.

## Setup convention

Preferred vault location on the lenaamarketing profile VPS:

```text
/home/hermes/.hermes/profiles/lenaamarketing/data/obsidian-vault
```

Set the profile env var:

```bash
OBSIDIAN_VAULT_PATH=/home/hermes/.hermes/profiles/lenaamarketing/data/obsidian-vault
```

Place it in:

```text
/home/hermes/.hermes/profiles/lenaamarketing/.env
```

Then restart the gateway/session so the environment is reloaded:

```bash
hermes gateway restart
```

From Telegram, `/restart` is also acceptable.

## Preferred sync methods

1. Git repo vault:

```bash
mkdir -p /home/hermes/.hermes/profiles/lenaamarketing/data
git clone <OBSIDIAN_REPO_URL> /home/hermes/.hermes/profiles/lenaamarketing/data/obsidian-vault
```

2. Manual upload:

```bash
scp -r "/local/path/to/Obsidian Vault" hermes@<server-ip>:/home/hermes/.hermes/profiles/lenaamarketing/data/obsidian-vault
```

## Analysis workflow

When analyzing ads:

1. Use Meta/MCP to identify what performed.
2. Resolve `OBSIDIAN_VAULT_PATH`.
3. Search Obsidian for ad name, hook, creator, angle, offer, campaign name, or script text.
4. If a matching note exists, use it to explain likely creative reasons.
5. If no note exists, explicitly say creative context is not connected/found and infer only from visible Meta creative text.

## Pitfall

Do not recreate a separate repo-tracked Ads Library if the user has chosen Obsidian as the creative source of truth. Use Obsidian directly and keep any additional mapping layer minimal unless the user explicitly asks for one.
