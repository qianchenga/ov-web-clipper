import{mkdir,writeFile,copyFile,readFile}from'node:fs/promises';
const manifest={manifest_version:3,name:'OV Web Clipper',version:'0.5.1',description:'提取网页和选中文字，预览批注后收录到所配OpenViking，查询处理状态并检索回读。',minimum_chrome_version:'116',permissions:['activeTab','scripting','storage','contextMenus','sidePanel'],action:{default_title:'采集当前网页并打开侧边栏'},background:{service_worker:'background.js',type:'module'},optional_host_permissions:['https://*/*','http://localhost/*','http://127.0.0.1/*'],side_panel:{default_path:'index.html?panel=1'},options_page:'index.html',content_security_policy:{extension_pages:"script-src 'self'; object-src 'none'; connect-src https: http://localhost:* http://127.0.0.1:*; img-src 'self' data:; font-src 'self'; style-src 'self'"}};
await writeFile('dist/manifest.json',JSON.stringify(manifest,null,2));for(const f of['background.js','core.mjs','settings.mjs','ov-client.mjs'])await copyFile('extension/'+f,'dist/'+f);
await mkdir('dist/licenses',{recursive:true});
const licenses={defuddle:'defuddle/LICENSE',react:'react/LICENSE','react-dom':'react-dom/LICENSE',scheduler:'scheduler/LICENSE','lucide-react':'lucide-react/LICENSE', 'mathml-to-latex':'mathml-to-latex/LICENSE.md',xmldom:'@xmldom/xmldom/LICENSE',turndown:'turndown/LICENSE',domino:'@mixmark-io/domino/LICENSE',tailwindcss:'tailwindcss/LICENSE'};
for(const [name,file] of Object.entries(licenses))await copyFile('node_modules/'+file,'dist/licenses/'+name+'.txt');
for(const pkg of ['archivo','hanken-grotesk','space-mono']){
 let found=false;
 for(const f of ['LICENSE','OFL.txt'])try{await copyFile('node_modules/@fontsource/'+pkg+'/'+f,'dist/licenses/'+pkg+'-OFL.txt');found=true;break;}catch(e){if(e.code!=='ENOENT')throw e;}
 if(!found)throw Error('Missing font license: '+pkg);
}
for(const f of ['LICENSE','THIRD_PARTY_NOTICES.md'])await copyFile(f,'dist/'+f);
await writeFile('dist/README.md','# OV Web Clipper\n\nInstall: open chrome://extensions, enable Developer mode, choose Load unpacked, and select this folder (manifest.json at root). Configure your own OV server and user API Key; no server or credentials are included.\n\n安装：Chrome 打开 chrome://extensions，开启开发者模式，加载本目录。在连接设置填写自己的 OV 地址和用户 Key，先验证再预览上传。\n\nSource, privacy, full instructions and updates: https://github.com/pengqiancheng-sys/ov-web-clipper\n');
console.log('Chrome MV3 extension packaged in dist/');
