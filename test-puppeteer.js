const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    const content = await page.content();
    if (content.includes('id="root"')) {
        const rootContent = await page.$eval('#root', el => el.innerHTML);
        console.log('Root Content length:', rootContent.length);
        if (rootContent.length === 0) console.log('WHITE SCREEN CONFIRMED');
    }
  } catch (e) {
    console.error('PUPPETEER ERROR:', e);
  }
  await browser.close();
})();
