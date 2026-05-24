# lenaa Ads API — local Node service pattern

Use this reference when setting up a deterministic Ads data/API layer for lenaa on the VPS.

## Recommended paths

Production/default layout:

- App code: `/opt/lenaa/ads-api`
- Production env/secrets: `/etc/lenaa` or `/etc/lenaa/ads-api.env`
- Logs: `/var/log/lenaa/ads-api`
- Runtime URL: `http://127.0.0.1:3030`

Repo-tracked profile layout, when Sahajit wants the API committed with the lenaamarketing profile:

- App code: `/home/hermes/.hermes/profiles/lenaamarketing/apis/ads-api`
- Secrets: `.env` in the app dir only temporarily, always gitignored; prefer `.env.example` in Git
- Runtime URL: `http://127.0.0.1:3030`

Use `/opt/lenaa/...` when deployment isolation matters. Use the profile `apis/` folder when Git versioning and quick iteration are more important than process separation.

## Permission model

Good v1 setup:

```bash
sudo mkdir -p /opt/lenaa/ads-api /etc/lenaa /var/log/lenaa/ads-api
sudo chown -R hermes:hermes /opt/lenaa /var/log/lenaa
sudo chown root:hermes /etc/lenaa
sudo chmod 750 /etc/lenaa
```

This lets Hermes write app code/logs while keeping production secrets more controlled. If Hermes cannot write `/etc/lenaa`, use `/opt/lenaa/ads-api/.env` temporarily and move secrets later.

## Minimal proof-of-life service

Create a small dependency-free Node service before adding Meta/Google Ads logic:

- use Node's built-in `http` server and global `fetch()`; no Express needed for v1
- `GET /health` returns `{ ok: true, service: 'lenaa-ads-api' }`
- `GET /request-test` performs one outbound `fetch()` to a configured `TEST_REQUEST_URL`
- default proof target can be `https://example.com`; avoid relying on flaky demo APIs if they return 5xx
- add `npm run test:request` to call the local endpoint and fail if outbound request failed

This verifies:

- Node runtime works
- local API binds to localhost
- Hermes can call local endpoints via curl/scripts
- the service can make outbound requests

## Later production steps

- Add API-key auth, e.g. `Authorization: Bearer <ADS_API_KEY>`.
- Move env/secrets to `/etc/lenaa/ads-api.env`.
- Add a `lenaa-ads-api.service` systemd unit.
- Keep Ads actions read-only first; require explicit confirmation for budget/status/creative writes.
