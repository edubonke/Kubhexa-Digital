import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../public/analytics.js',import.meta.url),'utf8');
const id='G-LGV76Q02GP';
const canonical='https://edubonke.github.io/Kubhexa-Digital/contact/';
function setup(initial=null, embedded=false) {
  const storage=new Map(initial?[['kubhexa-analytics-consent-v1',initial]]:[]);
  const remote=[], events={}, elements={};
  for(const name of ['preferences','settings','accept','decline','choice-status']) elements['analytics-'+name]={hidden:true,attributes:{},listeners:{},setAttribute(k,v){this.attributes[k]=v},addEventListener(k,v){this.listeners[k]=v},focus(){}};
  const window={addEventListener(k,v){events[k]=v}};window.self=window;window.top=embedded?{}:window;
  const document={currentScript:{dataset:{measurementId:id,canonical,basePath:'/Kubhexa-Digital/'}},getElementById:id=>elements[id],referrer:'https://example.com/?email=private@example.com',cookie:'other=1',head:{appendChild(s){remote.push(s)}},createElement(){return {}}};
  const location={hostname:'edubonke.github.io'};
  const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
  vm.runInNewContext(source,{window,document,localStorage,location,URL,Date});
  const commands=()=>Array.from(window.dataLayer??[],x=>Array.from(x));
  return {window,document,storage,remote,events,elements,commands,click:name=>elements['analytics-'+name].listeners.click()};
}

test('analytics remains completely unloaded until explicit acceptance',()=>{
  const a=setup(); assert.equal(a.remote.length,0); assert.equal(a.elements['analytics-preferences'].hidden,false); assert.equal(a.window[`ga-disable-${id}`],true);
  a.events['kubhexa:generate_lead'](); assert.equal(a.commands().length,0);
  a.click('decline'); assert.equal(a.remote.length,0); assert.equal(a.storage.get('kubhexa-analytics-consent-v1'),'denied'); assert.equal(a.elements['analytics-preferences'].hidden,true);
});
test('consent loads one Google tag, one clean page view and a confirmed lead only',()=>{
  const a=setup();a.click('accept');assert.equal(a.remote.length,1);assert.equal(a.remote[0].src,`https://www.googletagmanager.com/gtag/js?id=${id}`);
  const c=a.commands();assert.equal(c[0][0],'consent');assert.equal(c[0][2].analytics_storage,'denied');assert.equal(c[1][2].analytics_storage,'granted');assert.equal(c[1][2].ad_storage,'denied');
  assert.equal(c.find(x=>x[0]==='config')[2].page_referrer,'https://example.com');assert.equal(c.find(x=>x[0]==='config')[2].allow_google_signals,false);
  a.events['kubhexa:generate_lead']({detail:{email:'do-not-send@example.com',receipt:'private'}});
  let lead=a.commands().filter(x=>x[1]==='generate_lead');assert.equal(lead.length,1);assert.equal(lead[0][2].page_location,canonical);assert.deepEqual(Object.keys(lead[0][2]).sort(),['form_id','page_location','send_to']);
  a.click('settings');a.click('decline');a.events['kubhexa:generate_lead']();assert.equal(a.commands().filter(x=>x[1]==='generate_lead').length,1);assert.equal(a.window[`ga-disable-${id}`],true);
  a.click('settings');a.click('accept');assert.equal(a.remote.length,1);assert.equal(a.commands().filter(x=>x[1]==='page_view').length,1);
});
test('consent persists across pages and embedded previews cannot load analytics',()=>{
  assert.equal(setup('denied').remote.length,0);assert.equal(setup('granted').remote.length,1);assert.equal(setup('granted',true).remote.length,0);
  const a=setup('granted');a.events.storage({key:'kubhexa-analytics-consent-v1',newValue:'denied'});assert.equal(a.window[`ga-disable-${id}`],true);a.events['kubhexa:generate_lead']();assert.equal(a.commands().filter(x=>x[1]==='generate_lead').length,0);
});
