const fs = require('fs');

export default async function (req, res) {
  console.log(req.body)
  let rankJson =  JSON.parse(fs.readFileSync('rank.json'))
  const newdata = rankJson.data;
  newdata.push(req.body)
  rankJson.data = newdata
  fs.writeFileSync('rank.json', JSON.stringify(rankJson))
  res.status(200).json({})
}