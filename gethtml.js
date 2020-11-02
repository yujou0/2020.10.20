import axios from 'axios'
import cheerio from 'cheerio'
import qs from 'querystring'

const getHTML = async () => {
  const response = await axios.post('http://tw-aed.mohw.gov.tw/SearchPlace.jsp', qs.stringify({ Action: 'Search' }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  const $ = cheerio.load(response.data)
  console.log($('.content2 li tr').length)
  for (let i = 0; i < $('.content2 li tr').length; i++) { console.log($('.content2 li tr').eq(i).text()) }
}
getHTML()
