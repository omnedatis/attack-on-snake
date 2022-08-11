import * as React from 'react';
import { Slider, Switch, TextField } from '@mui/material';
import styles from '../styles/Home.module.css';

export default function GameMeter(props) {
  const name = props.name;
  const {
    teleportOK,
    setTeleportOK,
    rockNumber,
    setRockNumber,
    boardSize,
    setBoardSize,
    delay,
    setSpeed
  } = props.gameSettings;
  const rockHandleChange = function (e) {
    const value = parseInt(e.target.value)
    if (value > ((boardSize * boardSize) / 20)) {
      throw 'too big'
    } else if (value < 0) {
      throw 'cannot be less then zero'
    } else {
      setRockNumber(value)
    }
  }
  const boardHandleChange = function (e) {
    const value = parseInt(e.target.value)
    if (value > 30) {
      throw 'too big'
    } else if (value < 10) {
      throw 'too small'
    } else {
      setBoardSize(value)
    }
  }
  const delayHandleChange = function (e, value) {
    setSpeed(value)
  }
  function valuetext(value) {
    return `${value}°C`;
  }
  return (<div className={name} style={{ zIndex: 4, opacity:1, backgroundColor:'#fff'}} >
    <h3>Teleport mode</h3>
    <Switch autoFocus={true} checked={teleportOK} onChange={() => setTeleportOK(!teleportOK)} />
    <h3>Rock number</h3>
    <TextField autoFocus={true} value={rockNumber} type="number" onChange={rockHandleChange} />
    <h3>Board size</h3>
    <TextField autoFocus={true} value={boardSize} type="number" onChange={boardHandleChange} />
    <h3>Speed</h3>
    <Slider autoFocus={true}
      size="small"
      valueLabelDisplay="auto"
      getAriaValueText={valuetext}
      onChange={delayHandleChange}
      step={1}
      defaultValue={1}
      min={1}
      max={4}
      marks />
  </div>)
}