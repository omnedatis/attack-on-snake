const fs = require('fs');

const emptyFile = {
  "columns": [
      {
          "field": "name",
          "headerName": "Name"
      },
      {
          "field": "score",
          "headerName": "score"
      },
      {
          "field": "teleportOK",
          "headerName": "Teleportation"
      },
      {
          "field": "rockNumber",
          "headerName": "Rocks"
      },
      {
          "field": "boardSize",
          "headerName": "Size"
      },
      {
          "field": "speed",
          "headerName": "Speed"
      }
  ],
  "data":[]
}

export default async function (req, res) {
  if (!(fs.existsSync('rank.json'))) {
    fs.writeFileSync('rank.json', JSON.stringify(emptyFile))
  }
  let rankJson =  JSON.parse(fs.readFileSync('rank.json'))
  const newdata = rankJson.data;
  newdata.push(req.body)
  rankJson.data = newdata
  fs.writeFileSync('rank.json', JSON.stringify(rankJson))
  res.status(200).json({})
}