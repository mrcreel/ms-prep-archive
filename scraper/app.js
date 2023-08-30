require("dotenv").config()
const { PORT } = process.env
const express = require("express")
const fs = require("fs")
const cheerio = require("cheerio")

const getPageData = async (page) => {}

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("Web Scraper!")
})

app.get("/scrape/teams", async (req, res) => {
  try {
    const pages = ["index", "Inactive"]
    const teams = []
    pages.map((ele) => {
      const uri = `./website/${ele}.htm`
      const data = fs.readFileSync(uri, "utf-8")
      const html = data
      const $ = cheerio.load(html)

      $("td[colspan=8] a").each((idx, ele) => {
        const team = {}
        team.name = $(ele).text()
        if (team.name.length > 3) {
          team.slug = $(ele).attr("href").split(".")[0]
          team.inState = true
          team.seasons = []
          teams.push(team)
        }
      })
    })
    teams.sort((a, b) => (a.slug > b.slug ? 1 : b.slug > a.slug ? -1 : 0))
    console.log(typeof JSON.stringify(teams))
    res.json(teams)
    fs.writeFileSync("./data/master.json", JSON.stringify(teams))
  } catch (error) {
    console.error(error)
    res.status(500).send("An error occurred while scraping the web page.")
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})

/*
<td colspan=8 class=xl12125132 width=152 style='border-left:none;width:112pt'>
```
 */
