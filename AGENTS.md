# Project guidance

Read README.md and CONTRIBUTING.md first. Keep capture local and uploads explicit. Do not ship credentials, private records or real deployment defaults. Public examples use reserved example.com domains. Respect tenant identity and server ACLs; paths are not authorization.

Use Node.js 22.12+. Before proposing a release run npm test, npm run build:extension and npm run audit:release. CI must not access real OV servers or production credentials. UI screenshots use clearly labeled fictional demo data. Passing tests is not proof of production browser/server acceptance.

Do not remove user data, retry ambiguous uploads, modify remote services, publish or merge without the relevant task authorization. Preserve third-party license notices.
