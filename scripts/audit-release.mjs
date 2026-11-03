import {readdir,readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {DEFAULT_SETTINGS} from '../extension/settings.mjs';
const root=new URL('../',import.meta.url);
const skip=new Set(['.git','node_modules','release']);
async function walk(base=''){const out=[];for(const e of await readdir(new URL(base,root),{withFileTypes:true})){if(skip.has(e.name))continue;const p=base+e.name;if(e.isSymbolicLink())throw Error(`Symlink not allowed: ${p}`);if(e.isDirectory())out.push(...await walk(p+'/'));else out.push(p);}return out;}
assert.equal(DEFAULT_SETTINGS.serverUrl,'','Public build must start without a server');
const files=await walk();
const badName=/(?:^|\/)(?:\.env(?:\..*)?|ovcli\.conf|cookies?\.json|credentials?\.json|[^/]+\.(?:pem|key|sqlite\w*|db|ovpack))$/i;
const patterns=[/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\b(?:sk|ov_api_key)-[A-Za-z0-9_-]{24,}/,/\/(?:Users|home)\/[A-Za-z0-9_.-]+\//,/Bearer\s+[A-Za-z0-9._-]{30,}/];
let scanned=0;
for(const name of files){assert.ok(!badName.test(name),`Disallowed release filename: ${name}`);if(/\.(png|woff2?)$/.test(name))continue;const buf=await readFile(new URL(name,root));assert.ok(buf.length<3*1024*1024,`Unexpected large text file: ${name}`);const s=buf.toString();for(const re of patterns)assert.ok(!re.test(s),`Sensitive content pattern in ${name}`);scanned++;}
const manifest=JSON.parse(await readFile(new URL('dist/manifest.json',root),'utf8'));
const pkg=JSON.parse(await readFile(new URL('package.json',root),'utf8'));
assert.equal(manifest.version,pkg.version);assert.equal(manifest.manifest_version,3);
assert.deepEqual(manifest.permissions,['activeTab','scripting','storage','contextMenus','sidePanel']);
assert.ok(!manifest.host_permissions,'Hosts must be optional, granted explicitly');
for(const file of files.filter(f=>/^dist\/assets\/.*\.js$/.test(f))){const s=await readFile(new URL(file,root),'utf8');for(const marker of ['demo-article-001','demo-task-001','界面演示 · 示例数据','让收藏进入下一次工作'])assert.ok(!s.includes(marker),`Demo fixtures leaked into production: ${file}`);}
for(const name of ['LICENSE','THIRD_PARTY_NOTICES.md','README.md'])await stat(new URL('dist/'+name,root));
for(const name of ['defuddle','react','react-dom','scheduler','lucide-react','mathml-to-latex','xmldom','turndown','domino','tailwindcss','archivo-OFL','hanken-grotesk-OFL','space-mono-OFL'])assert.ok((await stat(new URL('dist/licenses/'+name+'.txt',root))).size>100,`Missing license: ${name}`);
for(const name of ['inbox','settings','upload-confirmation','retrieval'])assert.ok((await stat(new URL('docs/screenshots/'+name+'.png',root))).size>10000,`Missing screenshot: ${name}`);
console.log(`Release preflight passed: ${scanned} text files; blank public server, permissions, no demo fixtures, licenses and screenshots verified. Manual review still required.`);
