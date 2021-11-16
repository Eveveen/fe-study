(async () => {
    const PCR = require('puppeteer-chromium-resolver');
    const stats = await PCR();
  
    const browser = await stats.puppeteer
      .launch({
        headless: true,
        args: ['--no-sandbox'],
        executablePath: stats.executablePath,
      })
      .catch(function (error) {
        console.log(error);
      });
  
    const Koa = require('koa');
    const app = new Koa();
  
    app.use(async ctx => {
      const { url } = ctx.query;
  
      // 这里演示不合理的Url校验
      if (!url) {
        ctx.body = 'Invalid url';
  
        return;
      }
  
      ctx.set('Content-Type', 'image/png');
  
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
  
      ctx.body = await page.screenshot({ encoding: 'binary', type: 'png' });
  
      await page.close();
    });
    app.listen(8083);
  
    console.log('server listening on port 8083');
  })();