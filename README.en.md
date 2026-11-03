# OV Web Clipper

A local-first Chrome extension that clips pages or selections directly into your own OpenViking server, without an Obsidian intermediary. Review Markdown and add separate notes, confirm the server and identity, upload explicitly, track the asynchronous task, then search and read back the original content.

Independent community project, not an official OpenViking product. MIT licensed. [中文文档与截图](README.md) · [Download](https://github.com/pengqiancheng-sys/ov-web-clipper/releases/latest).

## Install

Download the release ZIP, extract it, open `chrome://extensions`, enable Developer mode, select **Load unpacked**, and choose the folder directly containing `manifest.json`. No Chrome Web Store listing or automatic updates are provided.

In Connection Settings, enter your own HTTPS OV URL and tenant/user API Key, save, grant access to that server, and run the read-only connection test. Open a webpage and click the extension toolbar button. Review the content and destination before confirming upload. Query task status, then search and read back the content after processing finishes.

Default destination: `viking://~/resources/inbox/web-clipper`. Personal sites and shared project destinations are also supported. Directory names do not enforce tenant isolation; OV authorization and ACLs do. Articles are resources, not automatically user memories or Skills. Other AI clients need their own authorized retrieval integration.

## Privacy and limitations

No bundled server or credentials, telemetry, cookie/history reading, automatic page scanning, or automatic resubmission after ambiguous network failures. Keys use session storage by default; optional persistent local extension storage is **not an encrypted vault**. Upload sends content and metadata to the selected server, whose model providers may charge for processing. Remote media download is disabled. Local data does not sync across devices. Text-oriented Markdown workflow; complex websites may need selection capture. Maximum 100 clips, 1 MiB per body and approximately 6 MiB total local storage.

Chrome MV3, Chrome 116+. Built against OV 0.5.x, with development integration testing against 0.5.3; compatibility with every server version is not guaranteed. UI screenshots use clearly marked fictional demo data, not production acceptance evidence.

## Development

Node.js 22.12+ (CI: Node.js 24):

```bash
npm ci
npm test
npm run build:extension
npm run audit:release
```

Load `dist/` as an unpacked extension. `npm run dev` starts UI development; `?demo=1` enables a labeled, offline mock UI only in development. Demo fixtures are excluded from the production build. See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md) and [third-party notices](THIRD_PARTY_NOTICES.md).

[GitHub Actions CI](https://github.com/pengqiancheng-sys/ov-web-clipper/actions/workflows/ci.yml) runs on main pushes, pull requests and manual dispatch. It uses read-only repository permissions, no production credentials or real OV services, and does not deploy.
