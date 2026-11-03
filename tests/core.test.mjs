import{test}from'node:test';import assert from'node:assert/strict';import{safeUrl,validateCapture,insertClip,patchClip}from'../extension/core.mjs';
const sample=()=>validateCapture({title:'测试网页',body:'## 正文\n这是一篇用于验收的文章。',sourceUrl:'https://example.org/a?utm_source=x&token=secret&id=1',kind:'article'});
test('来源移除跟踪与凭据，保留语义参数',()=>assert.equal(sample().sourceUrl,'https://example.org/a?id=1'));
test('拒绝受限协议',()=>{for(const u of['chrome://extensions','file:///tmp/a','javascript:1'])assert.throws(()=>safeUrl(u));});
test('空正文与超大正文明确失败',()=>{assert.throws(()=>validateCapture({...sample(),body:''}));assert.throws(()=>validateCapture({...sample(),body:'字'.repeat(400000)}));});
test('同来源同哈希幂等，内容变更新版本',()=>{let a=insertClip([],sample(),'hash');let b=insertClip(a.clips,sample(),'hash');assert.equal(b.id,a.id);assert.equal(b.clips.length,1);assert(b.duplicate);let c=insertClip(a.clips,{...sample(),body:'新内容'},'newhash');assert.equal(c.clips.length,2);assert.equal(c.clips[0].previousVersion,a.id);});
test('批注与本地状态可保存，不能伪造OV状态或改来源',()=>{let a=insertClip([],sample(),'h');let b=patchClip(a.clips,a.id,{note:'批注',scope:'personal',status:'local',sourceUrl:'https://evil.org'});assert.equal(b[0].note,'批注');assert.equal(b[0].sourceUrl,a.clips[0].sourceUrl);assert.throws(()=>patchClip(b,a.id,{status:'done'}));});
test('非法范围与空编辑被拒绝，原文保持',()=>{let a=insertClip([],sample(),'h');assert.throws(()=>patchClip(a.clips,a.id,{scope:'../admin'}));assert.throws(()=>patchClip(a.clips,a.id,{body:' '}));assert.equal(a.clips[0].body,sample().body);});
