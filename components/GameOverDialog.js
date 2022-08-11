import { Button, Dialog, TextField } from '@mui/material'
import { useRef, useState } from 'react';
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

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
export default function GameOverDialog(props) {
    const fieldValue = useRef();
    const playerSettings = props.playerSettings;
    const dialogOn = props.OverDialogOn;
    const setGameId = props.setGameId;
    const gameId = props.gameId;
    const boardStates = props.boardStates;
    const setOverDialogOn = props.setOverDialogOn;
    const router = useRouter();
    const [text, setText] = useState('');

    const submitHandleClick = (e) => {
        fetcher('api/editRank', {"score":boardStates.current?.getScore(), "name":text, ...playerSettings})
    }
    const handleClose = function () {
        setOverDialogOn(false);
        setGameId(gameId + 1);
        boardStates.current?.setIsGameOver(false);
        router.push('/snake')

    }

    return <Dialog open={dialogOn} onClose={handleClose} className={styles.col} maxWidth="sm" fullWidth style={{ border: "10px" }}>
        <div className={styles.col} style={{ width: '50vmin', height: '50vmin', flexGrow: 5, margin: "20px" }}>
            <h1 >
                Game Over!!
            </h1>
            <h2>
                Please Enter Your Name:
            </h2>
            <TextField placeholder='your name' value={text} onChange={e => setText(e.target.value)} variant="standard" ref={fieldValue} />
            <Button variant="outlined" onClick={submitHandleClick} style={{ margin: "20px", color: "#a2a2a2", borderColor: "#a2a2a2" }}>submit</Button>
        </div>
    </Dialog>

}