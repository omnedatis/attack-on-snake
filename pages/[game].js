import styles from '../styles/Home.module.css';
import GameBoard from '../components/GameBoard';
import { useEffect, useRef, useState } from 'react';
import GameOverDialog from '../components/GameOverDialog';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpDialog from '../components/HelpDialog';
import GameMeter from '../components/GameMeter';
import RankDialog from '../components/RankDialog';
import InputScoeDialog from '../components/InputScoredialog';

// definitions
function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

const fetcher = async function (path, data) {
  const url = `http://localhost:3000/${path}`
  const req = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
    redirect: "follow"
  }
  const resp = await fetch(url, req).then(res => res.json())
  return resp
}
const readRank = async function () {
  const data = await fetcher('api/getRank').then(data => {
    return data.body.rankJson
  })
  return data
}
export default function Home(props) {
  // props or query
  const ranks = props.ranks;

  // states 
  // flow control
  const [OverDialogOn, setOverDialogOn] = useState(false);
  const [helpDialogOn, setHelpDialogOn] = useState(true);
  const [rankDialogOn, setRankDialogOn] = useState(false);
  const [isTranslated, setIsTranslate] = useState(false);
  const [meterName, setMeterName] = useState([styles.togglemeter]);
  const [gameId, setGameId] = useState(0);

  // game board io
  const [direction, setDirection] = useState(undefined);

  // parameter tuning
  const [teleportOK, setTeleportOK] = useState(true);
  const [rockNumber, setRockNumber] = useState(3);
  const [boardSize, setBoardSize] = useState(20);
  const [speed, setSpeed] = useState(1);

  // const
  const allowedDirections = new Map([
    ['ArrowDown', 'ArrowDown'],
    ['ArrowUp', 'ArrowUp'],
    ['ArrowLeft', 'ArrowLeft'],
    ['ArrowRight', 'ArrowRight']
  ]);
  const boardStates = useRef();
  const forceUpdate = useForceUpdate();
  const gameSettings = {
    teleportOK,
    setTeleportOK,
    rockNumber,
    setRockNumber,
    boardSize,
    setBoardSize,
    speed,
    setSpeed
  }
  const playerSettings = {
    teleportOK,
    rockNumber,
    boardSize,
    speed
  }

  // event handling
  const handleKeyUp = function (e) {
    const newDirection = allowedDirections.get(e.key);
    if (newDirection) {
      setDirection(newDirection);
    }
  }
  const handleClick = e => setDirection(undefined);
  const helpHandleClick = e => setHelpDialogOn(true);
  const rankHandleClick = e => setRankDialogOn(true);
  const meterHandleClick = e => {
    setIsTranslate(!isTranslated);
  }
  const boardListener = async (id) => {
    let refresh = false;
    let prev;
    while (true) {
      if (boardStates.current?.getIsGameOver() === true) {
        setOverDialogOn(true);
        refresh = true;
      }
      if (prev !== boardStates.current?.getScore()) {
        prev = boardStates.current?.getScore();
        refresh = true;
      }
      if (refresh) {
        forceUpdate();
      }
      const dum = await new Promise(r => setTimeout(r, 100)).then(d => d);
      refresh = false;
    }
  }

  //effects
  useEffect(e => {
    if (isTranslated) {
      setMeterName([styles.togglemeter, styles.translated]);
    } else {
      setMeterName([styles.togglemeter]);
    }
  }, [isTranslated])
  useEffect(() => {
    boardListener(1)
    document.getElementById("game-convas").focus();
  }, [])

  return (
    <div
      id="game-convas"
      style={{ display: 'flex', flexDirection: "column", justifyContent: "center", height: '100vh' }}
      tabIndex={1}
      onKeyDown={handleKeyUp}
      onClick={handleClick}
    >
      <HelpDialog helpDialogOn={helpDialogOn} setHelpDialogOn={setHelpDialogOn} />
      <GameOverDialog OverDialogOn={OverDialogOn} setOverDialogOn={setOverDialogOn} setGameId={setGameId} gameId={gameId} boardStates={boardStates} playerSettings={playerSettings}/>
      <RankDialog rankDialogOn={rankDialogOn} setRankDialogOn={setRankDialogOn} ranks={ranks} />
      <div style={{ position: 'relative' }}>
        <GameMeter name={meterName.join(" ")} gameSettings={gameSettings} />
        <div className={[styles.mid, styles.col].join(" ")} style={{ textAlign: "center", position: 'absolute', left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto', alignItems: 'stretch', zIndex: 1 }}>
          <h1>Welcome to snake</h1>
          <h2 style={{ marginTop: 0 }}>Your Score: {boardStates.current?.getScore()}</h2>
          <div className={[styles.mid, styles.col].join(" ")} style={{ alignItems: 'center', flexGrow: 1.5 }}>
            <GameBoard boardSize={boardSize}
              snakeDirection={direction}
              teleportOK={teleportOK}
              speed={speed}
              rockNumber={rockNumber}
              key={gameId}
              ref={boardStates}
            />
          </div>
        </div>
        <div className={styles.col} style={{ alignSelf: 'start', alignItems: 'stretch' }}>
          <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
            <div style={{ margin: '15px', zIndex: 3 }} onClick={rankHandleClick} >
              <EmojiEventsIcon fontSize="large" />
            </div>
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
export async function getServerSideProps(){
  const ranks = await readRank()
  return {props:{ranks:ranks}}
}