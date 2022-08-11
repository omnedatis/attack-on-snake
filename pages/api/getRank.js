const fs = require('fs')

export default async function getRank (req, res) {
  const rankJson =  JSON.parse(fs.readFileSync('rank.json'))
  res.status(200).json({body:{ rankJson }})
}