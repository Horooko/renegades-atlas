(function(root){'use strict';
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function project(xyz,camera){return{x:2400*(.5+(xyz[0]-camera.x)/camera.scale),y:2400*(.5-(xyz[1]-camera.y)/camera.scale)};}
 function zoomAt(view,factor,p,min,max){const s=clamp(view.s*factor,min,max),k=s/view.s;return{s,x:p.x-(p.x-view.x)*k,y:p.y-(p.y-view.y)*k};}
 function fit(w,h){const s=Math.max(.02,Math.min((w-40)/2400,(h-90)/2400));return{s,x:(w-2400*s)/2,y:(h-2400*s)/2+15};}
 function clusters(items,distance=35){const groups=[];for(const p of items){let g=groups.find(g=>Math.hypot(g.x-p.x,g.y-p.y)<distance);if(g){g.items.push(p);g.x=g.items.reduce((a,p)=>a+p.x,0)/g.items.length;g.y=g.items.reduce((a,p)=>a+p.y,0)/g.items.length;}else groups.push({x:p.x,y:p.y,items:[p]});}return groups;}
 function nearest(xyz,places,n=2){return [...places].sort((a,b)=>Math.hypot(a.xyz[0]-xyz[0],a.xyz[1]-xyz[1])-Math.hypot(b.xyz[0]-xyz[0],b.xyz[1]-xyz[1])).slice(0,n);}
 // Place each icon in the nearest free screen-space slot; world coordinates stay intact.
 function spread(items){const placed=[];for(const item of items){let target={...item,anchorX:item.x,anchorY:item.y};let found=false;for(let r=0;r<=600&&!found;r+=4){const steps=r?Math.max(16,Math.ceil(2*Math.PI*r/5)):1;for(let a=0;a<steps;a++){const angle=a/steps*Math.PI*2,x=item.x+Math.cos(angle)*r,y=item.y+Math.sin(angle)*r;if(placed.every(p=>Math.abs(p.x-x)>=42||Math.abs(p.y-y)>=60)){target.x=x;target.y=y;found=true;break;}}}placed.push(target);}return placed;}
 function tilePlan(view,w,h,dpr=1){const need=2400*view.s*Math.min(dpr,2),level=need<=2048?2048:need<=4096?4096:8192,step=2400*view.s*512/level,n=level/512,tiles=[];const left=clamp(Math.floor(-view.x/step),0,n),top=clamp(Math.floor(-view.y/step),0,n),right=clamp(Math.ceil((w-view.x)/step),0,n),bottom=clamp(Math.ceil((h-view.y)/step),0,n);for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)tiles.push({x,y,px:view.x+x*step,py:view.y+y*step,size:step});return{level,tiles};}
 const api={clamp,project,zoomAt,fit,clusters,nearest,spread,tilePlan};root.AtlasCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
