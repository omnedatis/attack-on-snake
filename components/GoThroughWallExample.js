import { useEffect, useState } from "react";
import GameBoard from "./GameBoard";

export default function GoThrouhghWallExample(props) {
  const reRender = props.reRender
  const boardSize = 4;
  const snakeStart = '1_1';
  const rocksStart = [];
  const appleStart = '3_1';
  const [direction, setDirection] = useState(undefined);
  useEffect(e => {
      
      const eat = async function () {
          setDirection('ArrowRight')
          await new Promise(r => setTimeout(r, 300))
          setDirection('ArrowRight')
          await new Promise(r => setTimeout(r, 210))
          setDirection('ArrowRight')
          await new Promise(r => setTimeout(r, 210))
          setDirection('ArrowRight')
          await new Promise(r => setTimeout(r, 210))
          setDirection('ArrowRight')
          await new Promise(r => setTimeout(r, 210))
          setDirection(undefined)
          }
      eat()
      }
  , [])

  return <GameBoard key={reRender} boardSize={boardSize}
  snakeDirection={direction}
  snakeStart={snakeStart}
  appleStart={appleStart}
  rocksStart={rocksStart}
  frame={{width:"200px"}}/>
}