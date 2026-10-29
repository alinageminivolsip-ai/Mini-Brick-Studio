const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('engine.js','utf8');
function setup(){
 const scope={cart:[{id:'a',people:[{name:'Анна'}],frame:'white-square',frameTexts:[]},{id:'b',people:[{name:'Борис'}],frame:'white-square',frameTexts:[]}],editingCartItemId:'',people:[],frameTexts:[],activeFrameTextId:'',draftStorage:{setItem(){},removeItem(){}},snap(){},saveCart(){},sync(){},closeCartModal(){},renderCartModal(){},notify(){},window:{scrollTo(){}},cartModal:{classList:{add(){}}}};
 vm.createContext(scope);
 vm.runInContext(source.slice(source.indexOf('function editCartItem('),source.indexOf('let frameAutoCentered=')),scope);
 return scope;
}
test('editing keeps saved frame intact and uses an independent configuration',()=>{
 const scope=setup();vm.runInContext('editCartItem("a");people[0].name="Изменено"',scope);
 assert.equal(scope.cart.length,2);assert.equal(scope.cart[0].people[0].name,'Анна');assert.equal(scope.cart[1].people[0].name,'Борис');assert.equal(scope.editingCartItemId,'a');
});
test('duplicated frame has independent people and unique ID',()=>{
 const scope=setup();vm.runInContext('duplicateCartItem("a");cart[2].people[0].name="Копия"',scope);
 assert.equal(scope.cart.length,3);assert.notEqual(scope.cart[2].id,'a');assert.equal(scope.cart[0].people[0].name,'Анна');
});
test('order includes edited frame once alongside all other saved frames',()=>{
 const scope=setup();scope.currentDraftStarted=true;scope.snapshotCurrentFrame=()=>({id:'draft',people:[{name:'Новое'}]});
 vm.runInContext(source.slice(source.indexOf('function orderFrames(){'),source.indexOf('function saveCart(){')),scope);
 scope.editingCartItemId='a';const items=vm.runInContext('orderFrames()',scope);assert.equal(items.length,2);assert.equal(items[0].id,'b');assert.equal(items[1].people[0].name,'Новое');
});
