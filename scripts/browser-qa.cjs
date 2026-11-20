// Browser regression tests against the actual static Pages build. No real enquiries are submitted.
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../out');
const output = path.resolve(__dirname, '../browser-qa-output');
const config = require('../site.config.json');
const basePath = config.basePath;
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.webp':'image/webp', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
fs.mkdirSync(output,{recursive:true});
const server = http.createServer((req,res)=>{
  const url = new URL(req.url,'http://localhost');
  if (!url.pathname.startsWith(basePath)) { res.writeHead(404); return res.end('Not found'); }
  let file = path.resolve(root,url.pathname.slice(basePath.length));
  if (file !== root && !file.startsWith(root+path.sep)) { res.writeHead(404); return res.end('Not found'); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end('Not found'); }
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

async function main() {
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base = `http://127.0.0.1:${server.address().port}${basePath}`;
  const browser = await chromium.launch({headless:true});
  const errors = [];
  try {
    for (const [width,height] of [[1440,900],[1280,720],[820,900],[390,844],[360,800]]) {
      const p = await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
      p.on('pageerror',e=>errors.push(e.message));
      // Do not depend on availability of external portfolio sites during isolated UI checks.
      await p.route('https://**/*',route=>route.abort());
      await p.goto(base,{waitUntil:'networkidle'});
      await p.evaluate(()=>document.fonts.ready);
      assert.equal(await p.locator('h1').count(),1);
      assert.equal(await p.locator('.hero-art img').evaluate(img=>img.complete&&img.naturalWidth>0),true);
      const dimensions = await p.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,theme:getComputedStyle(document.querySelector('#site-root')).backgroundColor,hero:document.querySelector('.hero').getBoundingClientRect().height}));
      assert(dimensions.document<=width+1,`Horizontal overflow at ${width}: ${JSON.stringify(dimensions)}`);
      assert.equal(dimensions.theme,'rgb(5, 6, 37)');
      const header = await p.locator('.site-header').boundingBox();
      assert(header.width<=width+1);
      await p.screenshot({path:path.join(output,`home-${width}.png`)});
      console.log(`Layout verified: ${width}×${height}; ${JSON.stringify(dimensions)}`);
      if(width===1440) {
        for(const section of ['#work','#concepts','#services','#website-options','#contact']) {
          await p.locator(section).scrollIntoViewIfNeeded();
          await p.screenshot({path:path.join(output,`${section.slice(1)}-desktop.png`)});
        }
        assert.equal(await p.locator('.portfolio-project').count(),4);
        assert.equal(await p.locator('.studio-facts article').filter({hasText:'Selected projects'}).locator('strong').innerText(),'4');
        for(const project of ['EduBonke','ShiftStart','Alphasonic International','Auntie & Uncle']) {
          await p.getByRole('button',{name:`Explore ${project}`,exact:true}).first().click();
          await p.locator('.portfolio-modal[open]').waitFor();
          if(project==='ShiftStart') assert.equal(await p.locator('.portfolio-modal iframe').getAttribute('src'),'https://edubonke.github.io/Shift-Start/');
          if(project==='Auntie & Uncle') assert.equal(await p.locator('.portfolio-modal iframe').getAttribute('src'),'https://edubonke.github.io/Auntie-Uncle-V2/');
          await p.getByRole('button',{name:'Expand preview'}).click();
          await p.locator('.portfolio-modal.is-expanded').waitFor();
          await p.getByRole('button',{name:'Restore preview size'}).click();
          await p.getByRole('button',{name:'Close website preview'}).click();
          await p.locator('.portfolio-modal[open]').waitFor({state:'hidden'});
        }
        await p.getByRole('button',{name:/A simpler way to book/}).click();
        await p.getByRole('button',{name:'Confirm demo selection'}).click();
        assert.match(await p.locator('.demo-confirmation').innerText(),/No real appointment/);
        await p.getByRole('button',{name:'Close project concept'}).click();
        await p.locator('.case-modal[open]').waitFor({state:'hidden'});
        await p.getByRole('button',{name:/Everything in one place/}).click();
        await p.getByRole('tab',{name:'Files'}).click();
        assert(await p.getByRole('button',{name:'Download example project outline'}).isVisible());
        await p.keyboard.press('Escape');
        await p.locator('.case-modal[open]').waitFor({state:'hidden'});
        await p.locator('.experience-lab').getByRole('button',{name:'Mobile',exact:true}).click();
        assert.equal(await p.locator('.lab-preview').getAttribute('data-viewport'),'mobile');
        await p.locator('.experience-lab').getByRole('button',{name:'Dark preview'}).click();
        assert.equal(await p.locator('.lab-preview').getAttribute('data-theme'),'dark');
        await p.getByRole('checkbox',{name:/Test the journey/}).click();
        await p.getByRole('tab',{name:'Activity'}).click();
        assert.match(await p.locator('#lab-panel').innerText(),/completed/);
        await p.locator('.service-toggle').first().click();
        assert.equal(await p.locator('.service-toggle').first().getAttribute('aria-expanded'),'true');
        await p.getByRole('button',{name:'Build my Start estimate'}).click();
        assert.match(await p.locator('.estimate-total').innerText(),/R2,990/);
        await p.locator('#estimate-pages').selectOption('2');
        assert.match(await p.locator('.estimate-total').innerText(),/R4,490/);
        await p.locator('.estimate-summary .button').click();
        await p.locator('.enquiry-package-selection').waitFor();
        assert.match(await p.locator('.enquiry-package-selection').innerText(),/R4,490/);
        await p.locator('.submit-button').click();
        assert.match(await p.getByRole('alert').innerText(),/check the fields/);
        let submitted;
        await p.route('https://**/functions/v1/kubhexa-enquiries',async route=>{
          const request=route.request();
          if(request.method()==='OPTIONS') return route.fulfill({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type'}});
          submitted=request.postDataJSON();
          await route.fulfill({status:201,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({received:true,reference:submitted.id})});
        });
        await p.locator('#name').fill('Browser QA Example');
        await p.locator('#email').fill('test@example.invalid');
        await p.locator('#brief').fill('An isolated browser test for a sample business website, not a real lead.');
        await p.locator('#timeline').selectOption({index:1});
        await p.locator('#consent').check();
        await p.locator('.submit-button').click();
        await p.locator('.enquiry-success').waitFor();
        assert.match(submitted.brief,/R4,490/);
        assert.match(await p.locator('.receipt-reference').innerText(),/KX-/);
        console.log('Portfolio dialogs, concepts, Experience Lab, services, pricing, estimator and mocked enquiry submission passed.');
      }
      if(width===390||width===820) {
        await p.getByRole('button',{name:'Open navigation'}).click();
        assert.equal(await p.getByRole('button',{name:'Close navigation'}).getAttribute('aria-expanded'),'true');
        await p.screenshot({path:path.join(output,`menu-${width}.png`)});
        await p.locator('#primary-navigation').getByText('Packages',{exact:true}).click();
        assert.equal(await p.getByRole('button',{name:'Open navigation'}).getAttribute('aria-expanded'),'false');
        console.log(`Mobile navigation passed at ${width}px.`);
      }
      await p.close();
    }
    const p=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});
    p.on('pageerror',e=>errors.push(e.message));
    await p.route('https://**/*',route=>route.abort());
    await p.goto(base+'templates/',{waitUntil:'networkidle'});
    assert.equal(await p.locator('.template-card').count(),6);
    await p.locator('#template-package-filter').selectOption('shop');
    assert.equal(await p.locator('.template-card').count(),1);
    await p.getByRole('button',{name:'Reset filters'}).click();
    assert.equal(await p.locator('.template-card').count(),6);
    await p.screenshot({path:path.join(output,'template-catalogue.png')});
    for(const id of ['neighbour','northline','luma','fieldform','table-thyme','morrow']) {
      const response=await p.goto(base+`templates/${id}/preview/`,{waitUntil:'networkidle'});
      assert.equal(response.status(),200);assert.equal(await p.locator('[data-page=demo]').count(),1);
      assert(await p.locator('h1').first().isVisible());
      await p.screenshot({path:path.join(output,`template-${id}.png`)});
    }
    await p.goto(base+'privacy/');assert(await p.locator('h1').isVisible());
    await p.close();
    assert.equal(errors.length,0,errors.join('\n'));
    console.log('All six interactive template routes, catalogue filters, privacy and browser checks passed.');
  } finally { await browser.close();server.close(); }
}
main().catch(e=>{console.error(e);server.close();process.exitCode=1;});
