import styles from '../styles/Home.module.css';
import GameBoard from '../components/GameBoard';
import { useEffect, useRef, useState } from 'react';
import GameOverDialog from '../components/GameOverDialog';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import HelpDialog from '../components/HelpDialog';
import GameMeter from '../components/GameMeter';


// definitions
function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}
export default function Home(props) {
  // props or query

  // states 
  // flow control
  const [OverDialogOn, setOverDialogOn] = useState(false);
  const [helpDialogOn, setHelpDialogOn] = useState(true);
  const [isTranslated, setIsTranslate] = useState(false);
  const [meterName, setMeterName] = useState([styles.togglemeter]);
  const [gameId, setGameId] = useState(0);

  // game board io
  const [direction, setDirection] = useState(undefined);

  // parameter tuning
  const [teleportOK, setTeleportOK] = useState(true);
  const [rockNumber, setRockNumber] = useState(3);
  const [boardSize, setBoardSize] = useState(20);
  const [delay, setDelay] = useState(200);

  // const
  const allowedDirections = new Map([
    ['ArrowDown', 'ArrowDown'],
    ['ArrowUp', 'ArrowUp'],
    ['ArrowLeft', 'ArrowLeft'],
    ['ArrowRight', 'ArrowRight']
  ]);
  const boardStates = useRef();
  const forceUpdate = useForceUpdate()
  const gameSettings = {
    teleportOK,
    setTeleportOK,
    rockNumber,
    setRockNumber,
    boardSize,
    setBoardSize,
    delay,
    setDelay
  }

  // event handling
  const handleKeyUp = function (e) {
    const newDirection = allowedDirections.get(e.key);
    if (newDirection) {
      setDirection(newDirection);
    }
  }
  const handleClick = e => setDirection(undefined);
  const helpHandleClick = e => setHelpDialogOn(true)
  const meterHandleClick = e => {
    setIsTranslate(!isTranslated)
  }
  const boardListener = async (id) => {
    let refresh = false;
    let prev;
    while (true){
      if (boardStates.current?.getIsGameOver() === true){
        setOverDialogOn(true);
        refresh = true;
      }
      if (prev !==boardStates.current?.getScore()){
        prev = boardStates.current?.getScore();
        refresh = true;
      }
      if (refresh){
        forceUpdate()
      }
      const dum =  await new Promise(r=>setTimeout(r,100)).then(d=>d);
      refresh = false;
    }
  }

  //effects
  useEffect(e => {
    if (isTranslated) {
      setMeterName([styles.togglemeter, styles.translated])
    } else {
      setMeterName([styles.togglemeter]);
    }
  }, [isTranslated])
  useEffect(() => {
    boardListener(1)
    document.getElementById("game-convas").focus()
  }, [])
  
  return (
    <div
      id="game-convas"
      style={{ display: 'flex', flexDirection: "column", justifyContent: "center", height: '100vh' }}
      tabIndex={0}
      onKeyDown={handleKeyUp}
      onClick={handleClick}
      >
      <HelpDialog helpDialogOn={helpDialogOn} setHelpDialogOn={setHelpDialogOn} />
      <GameOverDialog OverDialogOn={OverDialogOn} setOverDialogOn={setOverDialogOn} setGameId={setGameId} gameId={gameId} boardStates={boardStates} />
      <div style={{ position: 'relative' }}>
        <GameMeter name={meterName.join(" ")} gameSettings={gameSettings} />
        <div className={[styles.mid, styles.col].join(" ")} style={{ textAlign: "center", position: 'absolute', left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto', alignItems: 'stretch' }}>
          <h1>Welcome to snake</h1>
          <h2 style={{ marginTop: 0 }}>Your Score: {boardStates.current?.getScore()}</h2>
          <div className={[styles.mid, styles.col].join(" ")} style={{ alignItems: 'center', flexGrow: 1.5 }}>
            <GameBoard boardSize={boardSize}
              snakeDirection={direction}
              teleportOK={teleportOK}
              delay={delay}
              rockNumber={rockNumber}
              key={gameId}
              ref={boardStates}
            />
          </div>
        </div>
        <div className={styles.col} style={{ alignSelf: 'start', alignItems: 'stretch' }}>
          <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
            <div style={{ margin: '15px', zIndex: 3 }} onClick={meterHandleClick} >
              <FormatListBulletedIcon fontSize="large" />
            </div>
            <div style={{ margin: '15px', zIndex: 3 }} onClick={helpHandleClick} >
              <QuestionMarkIcon fontSize="large" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.row}>
        <h1>&nbsp;</h1>
      </div>
    </div>

  )
}

// export async function getServerSideProps() {
//   const pixelNumber = 20;
//   const snakeStart = `${randomInteger(1, pixelNumber)}_${randomInteger(1, pixelNumber)}`;
//   const appleStart = getEmptyCoordinate([snakeStart], pixelNumber);
//   const allowedDirections = new Map([
//     ['ArrowDown', 'ArrowDown'],
//     ['ArrowUp', 'ArrowUp'],
//     ['ArrowLeft', 'ArrowLeft'],
//     ['ArrowRight', 'ArrowRight']
//   ]);
//   return {
//     props: {
//       snakeStart: snakeStart,
//       appleStart: appleStart,
//       pixelNumber: pixelNumber,
//       allowedDirections: JSON.stringify(Object.fromEntries(allowedDirections))
//     }
//   }
// }