const randomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function getSnakeStart(req, res) {
  const {boardSize} = req.body;
  const snakeStart = `${randomInteger(1, boardSize)}_${randomInteger(1, boardSize)}`;
  res.status(200).json({body:{ snakeStart:snakeStart }});
}
