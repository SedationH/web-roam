import superagent from "superagent"
import cheerio from "cheerio"

interface TargetData {
  title: string
  desc: string
}

interface RetData {
  time: number
  data: TargetData[]
}

interface FileData {
  [propName: string]: object
}

class Crawler {
  private url = "http://toscrape.com/"
  constructor() {
    this.crawlProcess()
  }

  async getComposition() {
    const responseRet = await superagent.get(this.url)
    const responseHtml = responseRet.text
    return responseHtml
  }

  getTargetData(html: string) {
    console.log(html)
    const $ = cheerio.load(html)
    const trList = $($(".table")[1]).find("tr")

    const targetData: TargetData[] = trList.map(
      (index, item) => {
        if (index > 0) {
          const title = $(item).find("a").text()
          console.log(title)
          return title
        }
      }
    )
    console.log(targetData)
  }

  assemblyData() {}

  async crawlProcess() {
    // 爬取HTML结构
    const retHtml = await this.getComposition()
    // 获取目标数据
    const retData = this.getTargetData(retHtml)
    // 组装数据
    // const filter = this.assemblyData(retData)
  }
}

new Crawler()
