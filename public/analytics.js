/* Optional first-party analytics preferences. No Google tag loads before acceptance. */
(() => {
  const script = document.currentScript;
  const id = script?.dataset.measurementId;
  const canonical = script?.dataset.canonical;
  const cookiePath = script?.dataset.basePath;
  const panel = document.getElementById('analytics-preferences');
  if (!/^G-[A-Z0-9]+$/.test(id || '') || !canonical || !cookiePath || !panel || window.self !== window.top) return;
  const key = 'kubhexa-analytics-consent-v1';
  const disableKey = `ga-disable-${id}`;
  const consent = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' };
  const settings = document.getElementById('analytics-settings');
  const accept = document.getElementById('analytics-accept');
  const decline = document.getElementById('analytics-decline');
  const message = document.getElementById('analytics-choice-status');
  let choice = null, loaded = false, measured = false;
  try { choice = localStorage.getItem(key); } catch {}
  if (!['granted','denied'].includes(choice)) choice = null;
  window[disableKey] = choice !== 'granted';

  const tag = (...args) => { window.gtag(...args); };
  function grant() {
    window[disableKey] = false;
    if (!loaded) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      tag('consent','default',consent);
      tag('consent','update',{ ...consent, analytics_storage:'granted' });
      tag('js',new Date());
      // Never send arbitrary query strings, fragments, form entries or contact details.
      let referrer = '';
      try { referrer = new URL(document.referrer).origin; } catch {}
      tag('config',id,{ send_page_view:false, page_location:canonical, page_referrer:referrer,
        allow_google_signals:false, allow_ad_personalization_signals:false, cookie_prefix:'kubhexa', cookie_path:cookiePath });
      const remote = document.createElement('script');
      remote.async = true;
      remote.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(remote);
      loaded = true;
    } else tag('consent','update',{ ...consent, analytics_storage:'granted' });
    if (!measured) {
      tag('event','page_view',{ send_to:id, page_location:canonical });
      measured = true;
    }
  }

  function revoke() {
    window[disableKey] = true;
    if (loaded) tag('consent','update',consent);
    // Only remove this site's explicitly prefixed analytics cookies, not other GitHub Pages projects' cookies.
    for (const part of document.cookie.split(';')) {
      const name = part.trim().split('=')[0];
      if (!/^kubhexa_(?:_?ga(?:_|$)|gid$|gat(?:_|$))/.test(name)) continue;
      for (const domain of ['', `; Domain=${location.hostname}`]) {
        document.cookie = `${name}=; Max-Age=0; Path=${cookiePath}${domain}; Secure; SameSite=Lax`;
      }
    }
  }

  function choose(value) {
    choice = value;
    try { localStorage.setItem(key,value); } catch {}
    if (value === 'granted') grant(); else revoke();
    panel.hidden = true;
    settings.hidden = false;
    settings.setAttribute('aria-expanded','false');
    message.textContent = value === 'granted' ? 'Optional analytics enabled.' : 'Optional analytics disabled.';
    settings.focus();
  }
  accept.addEventListener('click',() => choose('granted'));
  decline.addEventListener('click',() => choose('denied'));
  settings.addEventListener('click',() => {
    panel.hidden = !panel.hidden;
    settings.setAttribute('aria-expanded',String(!panel.hidden));
    if (!panel.hidden) accept.focus();
  });
  window.addEventListener('storage',event => {
    if (event.key !== key && event.key !== null) return;
    choice = event.key === null ? null : event.newValue;
    if (choice === 'granted') grant(); else revoke();
    panel.hidden = ['granted','denied'].includes(choice);
    settings.setAttribute('aria-expanded',String(!panel.hidden));
  });
  window.addEventListener('kubhexa:generate_lead',() => {
    if (choice === 'granted' && loaded && !window[disableKey]) tag('event','generate_lead',{ send_to:id, page_location:canonical, form_id:'project_enquiry' });
  });
  settings.hidden = false;
  panel.hidden = choice !== null;
  settings.setAttribute('aria-expanded',String(!panel.hidden));
  if (choice === 'granted') grant();
  else if (choice === 'denied') revoke();
})();
