const express = require("express");
const puppeteer = require("puppeteer");
const cleanPage = require("./cleaner");

const app = express();
app.use(express.json());

app.post("/extract", async (req, res) => {

  const url = req.body.url;
  if(!url) return res.status(400).send("Missing URL");

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    await page.waitForTimeout(2000);

    const content = await page.evaluate(cleanPage);

    await browser.close();

    res.send(content);

  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
