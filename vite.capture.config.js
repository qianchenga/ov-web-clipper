import{defineConfig}from'vite';
export default defineConfig({build:{emptyOutDir:false,outDir:'dist',lib:{entry:'extension/capture.js',name:'OVWebCapture',formats:['iife'],fileName:()=> 'capture.js'}}});
