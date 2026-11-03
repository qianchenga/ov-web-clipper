import Defuddle from 'defuddle/full';
globalThis.__ovWebCapture=(kind)=>{
 const selection=window.getSelection()?.toString().trim()||'';
 if(kind==='selection'&&!selection)throw Error('没有选中文字，请先在网页选中文字再右键采集。');
 const doc=document.cloneNode(true);doc.querySelectorAll('script,style,noscript,form,input,textarea,[contenteditable="true"]').forEach(e=>e.remove());
 let result={};if(kind!=='selection')result=new Defuddle(doc,{url:location.href,markdown:true,useAsync:false,includeReplies:false,fetch:()=>{throw Error('本地采集不允许额外联网');}}).parse();
 const body=kind==='selection'?selection:(result.contentMarkdown||result.content||'');
 return{title:result.title||document.title||'未命名网页',body,selection,kind,sourceUrl:location.href,author:result.author||'',publishedAt:result.published||null};
};
