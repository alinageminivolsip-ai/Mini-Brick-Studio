(function(root){
 const api={
  isPristineDraft(draft){const p=draft.people?.[0];if(!p||draft.people.length!==1||draft.cartCount||draft.frame!=='white-square'||draft.photo||draft.texts?.length||!['','none'].includes(draft.background||''))return false;return p.name==='Герой 1'&&!p.note&&p.face==='A1'&&p.hair==='f1'&&Number(p.skin)===15&&Number(p.torso)===19&&Number(p.legs)===7&&!p.print&&!p.leftAccessory&&!p.rightAccessory&&!p.outfitAccessory&&!p.centerAccessory&&!p.boardAccessory;},
  canFit(count,size){return count<=({small:5,square:8,big:10}[size]||0);},
  humanPrice(pricing,items,calculator){return items.reduce((sum,item)=>sum+calculator(item.people,item.frame,!!item.frameBgData).total,0);}
 };
 if(typeof module!=='undefined')module.exports=api;else root.MiglikGuideModel=api;
})(typeof window!=='undefined'?window:this);
