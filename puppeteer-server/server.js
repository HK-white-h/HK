const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();
app.use(express.json());

app.post("/extract", async (req, res) => {

  const url = req.body.url;
  if(!url) return res.status(400).send("Missing URL");

  try {

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium"
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    await page.waitForTimeout(2000);

    const content = await page.evaluate(() => {
      document.querySelectorAll("script, style, iframe, nav, footer, header").forEach(e=>e.remove());

      return document.body.innerHTML;
    });

    await browser.close();

    res.send(content);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error: " + err.message);
  }
});

app.listen(3000, () => console.log("Running"));
