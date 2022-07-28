const randomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const getEmptyCoordinate = function (occupied, upperbound) {
  let newPos = `${randomInteger(1, upperbound)}_${randomInteger(1, upperbound)}`;
  while (occupied.includes(newPos)) {
      newPos = `${randomInteger(1, upperbound)}_${randomInteger(1, upperbound)}`;
  }
  return newPos
}
export default function getAppleStart(req, res) {
  const {occupied, boardSize} = req.body;
  const appleStart = getEmptyCoordinate(occupied, boardSize)
  res.status(200).json({body:{ appleStart:appleStart }});
}