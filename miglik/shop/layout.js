// Physical component sizes and the same 2 mm clearance used by order validation.
const gap=2;
export function characterBounds(person,catalog){
 const parts=Object.values(person.parts).map(id=>catalog.parts.find(p=>p.id===id)).filter(Boolean);
 return {w:Math.max(22,...parts.map(p=>p.width||22)),h:Math.max(42,...parts.map(p=>p.height||42))};
}
export function positionsValid(people,catalog,{w,h}){
 const boxes=people.map(p=>({...p,...characterBounds(p,catalog)}));
 return boxes.every((p,i)=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.y>=0&&p.x+p.w<=w+.01&&p.y+p.h<=h+.01&&boxes.every((q,j)=>i===j||!(p.x<q.x+q.w+gap&&p.x+p.w+gap>q.x&&p.y<q.y+q.h+gap&&p.y+p.h+gap>q.y)));
}
function extent(boxes,axis,size){const min=Math.min(...boxes.map(p=>p[axis]));return {min,span:Math.max(...boxes.map(p=>p[axis]+p[size]))-min};}
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function compactAxis(boxes,axis,size,limit){
 const original=extent(boxes,axis,size),order=boxes.map((_,i)=>i).sort((a,b)=>boxes[a][axis]-boxes[b][axis]),dense=Array(boxes.length).fill(0);
 // Keep every original separation along this axis. At least one axis separates
 // each pair, so independent gap contraction cannot make people overlap.
 for(let k=0;k<order.length;k++){
  const i=order[k];
  for(let j=0;j<k;j++){const prev=order[j];if(boxes[prev][axis]+boxes[prev][size]+gap<=boxes[i][axis])dense[i]=Math.max(dense[i],dense[prev]+boxes[prev][size]+gap);}
 }
 const minimum=Math.max(...boxes.map((p,i)=>dense[i]+p[size]));
 if(minimum>limit)return null;
 const ratio=original.span<=limit?1:Math.max(0,(limit-minimum)/(original.span-minimum));
 const positions=boxes.map((p,i)=>dense[i]+ratio*(p[axis]-original.min-dense[i]));
 const span=Math.max(...boxes.map((p,i)=>positions[i]+p[size]));
 const offset=clamp(original.min,0,Math.max(0,limit-span));
 return positions.map(p=>p+offset);
}
function packRows(boxes,{w,h}){
 // All row subsets are considered (at most ten people), including mixed sizes.
 const count=1<<boxes.length,rows=Array(count),best=Array(count).fill(Infinity),last=Array(count).fill(0);best[0]=-gap;
 for(let mask=1;mask<count;mask++){
  const ids=boxes.map((_,i)=>i).filter(i=>mask&(1<<i));
  const width=ids.reduce((sum,i)=>sum+boxes[i].w,0)+gap*(ids.length-1),height=Math.max(...ids.map(i=>boxes[i].h));
  if(width<=w)rows[mask]={ids,width,height};
 }
 for(let mask=1;mask<count;mask++)for(let row=mask;row;row=(row-1)&mask){
  if(!rows[row])continue;const height=best[mask^row]+gap+rows[row].height;
  if(height<=h&&height<best[mask]){best[mask]=height;last[mask]=row;}
 }
 if(!Number.isFinite(best[count-1]))return null;
 const chosen=[];for(let mask=count-1;mask;){const row=last[mask];chosen.push(rows[row]);mask^=row;}
 const averageY=row=>row.ids.reduce((sum,i)=>sum+boxes[i].y+boxes[i].h/2,0)/row.ids.length;
 chosen.sort((a,b)=>averageY(a)-averageY(b));
 const result=boxes.map(p=>({x:p.x,y:p.y})),vertical=extent(boxes,'y','h');
 let y=clamp(vertical.min+(vertical.span-best[count-1])/2,0,h-best[count-1]);
 for(const row of chosen){
  row.ids.sort((a,b)=>boxes[a].x-boxes[b].x||a-b);
  const horizontal=extent(row.ids.map(i=>boxes[i]),'x','w');
  let x=clamp(horizontal.min+(horizontal.span-row.width)/2,0,w-row.width);
  for(const i of row.ids){result[i]={x,y};x=x+boxes[i].w+gap;}
  y=y+row.height+gap;
 }
 return result;
}
export function fitCharacters(people,catalog,frame){
 if(!people.length||positionsValid(people,catalog,frame))return people.map(p=>({...p}));
 const boxes=people.map(p=>({...p,...characterBounds(p,catalog)}));
 if(boxes.some(p=>p.w>frame.w||p.h>frame.h))return null;
 const xs=compactAxis(boxes,'x','w',frame.w),ys=compactAxis(boxes,'y','h',frame.h);
 if(xs&&ys){const result=people.map((p,i)=>({...p,x:xs[i],y:ys[i]}));if(positionsValid(result,catalog,frame))return result;}
 const packed=packRows(boxes,frame);
 if(!packed)return null;
 const result=people.map((p,i)=>({...p,...packed[i]}));
 return positionsValid(result,catalog,frame)?result:null;
}
