const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const pointsToMm=value=>Number(value)*25.4/72;
export const mmToPoints=value=>Math.round(Number(value)*72/25.4*10)/10;
export const textTransform=t=>`translate(${t.x} ${t.y}) rotate(${Number(t.rotation||0)})`;
export const textFonts={sans:'Segoe UI,Arial,sans-serif',serif:'Georgia,serif',hand:'Comic Sans MS,Segoe Print,cursive'};
export function textSvg(t){
 const lines=String(t.value).replace(/\r\n?/g,'\n').split('\n');
 return `<g data-text="${escape(t.id)}" transform="${textTransform(t)}" role="img" aria-label="Надпись: ${escape(t.value)}"><text x="0" y="${t.size*.8}" font-size="${t.size}" fill="${escape(t.color)}" text-anchor="${escape(t.align||'middle')}" font-family="${textFonts[t.font]||textFonts.sans}" font-style="${t.italic?'italic':'normal'}" xml:space="preserve">${lines.map((line,i)=>`<tspan x="0" dy="${i?t.size*1.2:0}">${escape(line)||'&#160;'}</tspan>`).join('')}</text></g>`;
}
