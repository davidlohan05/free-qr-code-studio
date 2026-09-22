/*
 * Adsterra integration for Free QR Code Studio.
 *
 * The supplied publisher snippets are loaded only after the page is ready,
 * so QR generation is never dependent on an ad request completing.
 *
 * Units supplied by the site owner:
 * - Banner 300x250
 * - Popunder
 * - Banner 728x90
 * - Social Bar
 * - Native Banner
 */
(() => {
  'use strict';

  const units = {
    banner300: {
      key: 'd8858b56ba6723c00db5b3ca0d2be7ec',
      src: 'https://www.highrevenueformat.com/d8858b56ba6723c00db5b3ca0d2be7ec/invoke.js',
      width: 300,
      height: 250
    },
    popunder: {
      src: 'https://pl31447974.profitableratecpmnetwork.com/b2/cc/85/b2cc8526cf8e50b53140d6f2d1b9ab0d.js'
    },
    banner728: {
      key: 'c0962a385f9cce60d10fe8cdcd8b6b7c',
      src: 'https://www.highrevenueformat.com/c0962a385f9cce60d10fe8cdcd8b6b7c/invoke.js',
      width: 728,
      height: 90
    },
    socialBar: {
      src: 'https://pl31447937.profitableratecpmnetwork.com/42afed4f88c46680e41a8f443196b41f/invoke.js',
      container: 'container-42afed4f88c46680e41a8f443196b41f'
    },
    nativeBanner: {
      src: 'https://pl31447936.profitableratecpmnetwork.com/64/d9/b3/64d9b3c2ea301c8e56e1f20a75051f86.js'
    }
  };

  const once = (fn) => {
    let done = false;
    return (...args) => {
      if (done) return;
      done = true;
      return fn(...args);
    };
  };

  function loadScript(src, options = {}) {
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.defer = true;
      if (options.id) s.id = options.id;
      const finish = once(resolve);
      s.onload = () => finish(true);
      s.onerror = () => {
        console.warn('[FQS Ads] Adsterra unit failed to load:', src);
        finish(false);
      };
      (options.parent || document.body || document.head).appendChild(s);
    });
  }

  async function loadBanner(containerId, unit) {
    const host = document.getElementById(containerId);
    if (!host) return;
    host.dataset.adProvider = 'adsterra';
    host.dataset.adStatus = 'loading';

    // Run the exact banner snippet inside an isolated iframe. This preserves
    // Adsterra's parser-time script behavior while preventing third-party ad
    // code from replacing or blocking the main document.
    const frame = document.createElement('iframe');
    frame.title = 'Advertisement';
    frame.loading = 'lazy';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.style.width = `${unit.width}px`;
    frame.style.maxWidth = '100%';
    frame.style.height = `${unit.height}px`;
    frame.style.minHeight = `${unit.height}px`;
    frame.style.border = '0';
    frame.style.overflow = 'hidden';
    frame.setAttribute('aria-label', 'Advertisement');
    const onReady = once(() => {
      host.dataset.adStatus = 'loaded';
    });
    frame.addEventListener('load', onReady, { once: true });
    host.appendChild(frame);

    const key = JSON.stringify(unit.key);
    const src = JSON.stringify(unit.src);
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=${unit.width},initial-scale=1"><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:transparent}body{display:flex;align-items:center;justify-content:center}</style></head><body><script>window.atOptions={key:${key},format:'iframe',height:${unit.height},width:${unit.width},params:{}};<\/script><script src=${src}></script></body></html>`;
    setTimeout(() => {
      if (host.dataset.adStatus === 'loading') host.dataset.adStatus = 'timeout';
    }, 10000);
  }

  async function loadNative() {
    const hosts = [
      document.getElementById('ad-in-content'),
      document.getElementById('ad-in-content-mobile')
    ].filter(Boolean);
    if (!hosts.length) return;

    // The supplied Native Banner code is designed to create its own content.
    // Load it once in the first visible native slot to avoid duplicate impressions.
    const host = hosts[0];
    host.dataset.adProvider = 'adsterra';
    host.dataset.adStatus = 'loading';
    const ok = await loadScript(units.nativeBanner.src, { parent: host });
    host.dataset.adStatus = ok ? 'loaded' : 'error';
    for (const extra of hosts.slice(1)) {
      extra.dataset.adProvider = 'adsterra';
      extra.dataset.adStatus = 'secondary-slot';
    }
  }

  async function loadSocialBar() {
    const container = document.getElementById(units.socialBar.container);
    // Adsterra's Social Bar script is global and the provider creates the UI.
    const ok = await loadScript(units.socialBar.src, { parent: document.body });
    document.documentElement.dataset.adsterraSocialBar = ok ? 'loaded' : 'error';
    if (container) container.dataset.adStatus = ok ? 'loaded' : 'error';
  }

  async function loadPopunder() {
    const ok = await loadScript(units.popunder.src, { parent: document.head });
    document.documentElement.dataset.adsterraPopunder = ok ? 'loaded' : 'error';
  }

  async function boot() {
    // The supplied codes are explicitly authorized by the site owner in this chat.
    // Load asynchronously after the app is interactive.
    await new Promise((resolve) => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') return resolve();
      window.addEventListener('DOMContentLoaded', resolve, { once: true });
    });

    // Keep the QR UI independent from ads. Each unit is isolated so one failure
    // cannot stop the remaining units or the QR generator.
    await loadBanner('ad-top-banner', units.banner728);
    await loadBanner('ad-sidebar', units.banner300);
    await loadNative();
    await loadPopunder();
    await loadSocialBar();

    // One banner code is used once per page. The extra layout slots remain
    // available for future Adsterra units instead of duplicating the same
    // publisher code and potentially creating duplicate impressions.
  }

  // Defer ad work so first interaction/QR generation is not delayed.
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => { boot().catch((e) => console.warn('[FQS Ads] boot failed', e)); }, { timeout: 2500 });
  } else {
    setTimeout(() => boot().catch((e) => console.warn('[FQS Ads] boot failed', e)), 1200);
  }
})();
