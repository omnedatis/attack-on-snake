import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import styles from '../styles/Home.module.css'
import Bomb from './Bomb';

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
const getWallCordinates = function (upperbound) {
    let ret = new Set();
    for (let i = 0; i <= upperbound; i++) {
        ret.add(`0_${i}`);
        ret.add(`${i}_0`);
        ret.add(`${upperbound}_${i}`);
        ret.add(`${i}_${upperbound}`);
    }
    return ret;
}
const snakeTeleport = function (coordinate, direction, boundNumber) {
    let ret = coordinate.split("_");
    switch (direction) {
        case 'ArrowDown':
            ret[1] = 1;
            break;
        case 'ArrowUp':
            ret[1] = boundNumber;
            break;
        case 'ArrowLeft':
            ret[0] = boundNumber;
            break;
        case 'ArrowRight':
            ret[0] = 1;
            break;
        default:
            return;
    }
    return ret.join('_');
}
const snakeGo = function (coordinate, direction) {
    let ret = coordinate.split("_");
    switch (direction) {
        case 'ArrowDown':
            ret[1]++;
            break;
        case 'ArrowUp':
            ret[1]--;
            break;
        case 'ArrowLeft':
            ret[0]--;
            break;
        case 'ArrowRight':
            ret[0]++;
            break;
        default:
            return;
    }
    return ret.join('_');
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
const getSnakeStart = async function (boardSize) {
    const path = '/api/getSnakeStart'
    const resp = await fetcher(path, { boardSize: boardSize }).then(data => data);
    return resp.body.snakeStart
}
const getAppleStart = async function (occupied, boardSize) {
    const path = '/api/getAppleStart'
    const resp = await fetcher(path, { boardSize: boardSize, occupied: occupied }).then(data => data);
    return resp.body.appleStart
}
const bust = function (loc) {
    const ret = [];
    let [x, y] = loc.split("_")
    x = parseInt(x);
    y = parseInt(y);
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            ret.push([i, j].join("_"))
        }
    }
    return ret
}
const speedMap = new Map([
    [1, 200],
    [2, 150],
    [3, 100],
    [4, 50]
])
const GameBoard = forwardRef((props, ref) => {

    // props
    const direction = props.snakeDirection;

    // optional props
    const snakeStart = props.snakeStart
    const appleStart = props.appleStart
    const rocksStart = props.rocksStart ?? [];
    const teleportOK = props.teleportOK ?? true;
    const speed = props.speed ?? 1;
    const rockNumber = props.rockNumber ?? 3;
    const boardSize = props.boardSize ?? 20;
    const boundNumber = boardSize + 1;
    const frame = props.frame ?? { height: '50vmin', width: '50vmin' }; // clean this up in future

    //consts
    const wallCoordinates = getWallCordinates(boundNumber);
    const genRockPeriod = 15;
    const genBombperiod = 90;
    const bombLifeTime = 15; // apropximatelly x3 frames
    const cycle = 180;

    //local states
    const [appleCoordinate, setAppleCoordinate] = useState(appleStart);
    const [snakeCoordinates, setSnakeCoordinates] = useState([snakeStart]);
    const [rockCoordinates, setRockCoordinates] = useState(rocksStart);
    const [bombCoordinate, setBombCoordinate] = useState(undefined);
    const [score, setScore] = useState(0);
    const [count, setCount] = useState(1); //delay instant generation
    const [snakeDirection, setSnakeDirection] = useState(undefined);
    const [isGameOver, setIsGameOver] = useState(false);
    const [bombTimer, setBombTimer] = useState(bombLifeTime);
    const [busted, setBusted] = useState([]);

    //effects
    useEffect(() => {
        let snake;
        if (snakeStart === undefined) {
            snake = getSnakeStart(boardSize).then(data => {
                setSnakeCoordinates([data])
                return data
            });
        }
        if (appleStart === undefined) {
            getAppleStart([snake], boardSize).then(data => setAppleCoordinate(data));
        }
    }, [])
    useEffect(() => {
        const t = setInterval(() => {

            if (snakeDirection && (!isGameOver)) {
                let newCoordinate = snakeGo(snakeCoordinates[0], snakeDirection);
                const newcoordinates = snakeCoordinates.slice();
                if (wallCoordinates.has(newCoordinate)) {
                    if (!teleportOK) {
                        setIsGameOver(true);
                        return
                    } else {
                        newCoordinate = snakeTeleport(snakeCoordinates[0], snakeDirection, boundNumber - 1);
                    }

                } else if (snakeCoordinates.includes(newCoordinate)) {
                    setIsGameOver(true);
                    return
                } else if (rockCoordinates.includes(newCoordinate)) {
                    setIsGameOver(true);
                    return
                } else if (newCoordinate === bombCoordinate) {
                    setIsGameOver(true);
                    return
                } 
                if (newCoordinate === appleCoordinate) {
                    newcoordinates.unshift(newCoordinate);
                    setSnakeCoordinates(newcoordinates);
                    setAppleCoordinate(getEmptyCoordinate(newcoordinates.concat(rockCoordinates), boundNumber - 1));
                    setScore(score + 1);
                } else {
                    newcoordinates.unshift(newCoordinate);
                    newcoordinates.pop();
                    setSnakeCoordinates(newcoordinates);
                }

                setCount((count + 1) % cycle)

                if ((count % genRockPeriod) === 0) {
                    const newRockCoordinates = rockCoordinates.slice();
                    if (newRockCoordinates.length > rockNumber) {
                        newRockCoordinates.pop();
                    } else {

                        const gen = randomInteger(1, 3);
                        if (gen === 1) {
                            newRockCoordinates.unshift('');
                        } else {
                            const front1 = snakeGo(snakeCoordinates[0], snakeDirection);
                            const front2 = snakeGo(front1, snakeDirection);
                            const newRock = getEmptyCoordinate(newcoordinates.concat([appleCoordinate, front1, front2], rockCoordinates), boardSize)
                            newRockCoordinates.unshift(newRock);
                        }
                        if (newRockCoordinates.length > rockNumber) {
                            newRockCoordinates.pop()
                        }
                    }

                    setRockCoordinates(newRockCoordinates)
                }

                if ((count % genBombperiod) === 0) {
                    const front1 = snakeGo(snakeCoordinates[0], snakeDirection);
                    const front2 = snakeGo(front1, snakeDirection);
                    const newBomb = getEmptyCoordinate(newcoordinates.concat([appleCoordinate, front1, front2], rockCoordinates), boardSize);
                    setBombCoordinate(newBomb);
                }

                if (bombCoordinate !== undefined) {
                    if (bombTimer >= 1) {
                        setBombTimer(bombTimer - 0.3);
                    } else if (bombTimer > 0) {
                        setBusted(bust(bombCoordinate));
                        setBombTimer(bombTimer - 0.3 >= 0 ? bombTimer - 0.3 : 0);
                    } else {
                        setBombTimer(bombLifeTime);
                        setBusted([]);
                        setBombCoordinate(undefined);
                    }
                }
            }
        }, speedMap.get(speed))
        return () => clearInterval(t)
    });
    useEffect(e => {
        if (busted === undefined) return
        let snakebreak= Infinity, newApple = false;
        const newSnakeCoordinates = snakeCoordinates.slice();
        const newRockCoordinates = rockCoordinates.slice();
        for (const each of busted) {
            if (newSnakeCoordinates.indexOf(each) > 0){
                snakebreak = Math.min(newSnakeCoordinates.indexOf(each), snakebreak);
            }
            
            newApple = newApple || each === appleCoordinate;
            const rockBusted  = newRockCoordinates.indexOf(each)
            if (rockBusted > 0 ) {
                newRockCoordinates.splice(rockBusted, 1)
            }
        }
        // snake update
        if (snakebreak === 0){
            setIsGameOver(true);
            return
        } else if (snakebreak !== Infinity) {
            setSnakeCoordinates(newSnakeCoordinates.slice(0, snakebreak));
            setScore(parseInt(score/2));
        }
        // apple update
        const dum = newApple && setAppleCoordinate(getEmptyCoordinate(snakeCoordinates.concat(rockCoordinates), boundNumber - 1));
        
        // rock update
        setRockCoordinates(newRockCoordinates);
    }, [busted])
    useEffect(e => {
        if (direction !== undefined) {
            if (snakeGo(snakeCoordinates[0], direction) === snakeCoordinates[1]) return;
        }
        setSnakeDirection(direction);

    }, [direction]);

    // other hooks
    useImperativeHandle(ref, () => ({
        getScore: () => score,
        getIsGameOver: () => isGameOver,
        setIsGameOver: (yn) => setIsGameOver(yn),
    }));
    const board = Array(boundNumber + 1).fill().slice().map(($, i) => {
        const rowItems = Array(boundNumber + 1).fill().slice().map(($, j) => {
            const isSnake = snakeCoordinates.includes(`${j}_${i}`);
            const isWall = wallCoordinates.has(`${j}_${i}`);
            const isApple = (appleCoordinate === `${j}_${i}`);
            const isBomb = (bombCoordinate === `${j}_${i}`);
            const isRock = rockCoordinates.includes(`${j}_${i}`);
            const isbusted = busted.includes(`${j}_${i}`);
            const name = [styles.grid];
            if (snakeCoordinates[0] === `${j}_${i}`)
                return <div key={`item_${j}_${i}`} className={[styles.grid, styles.head].join(" ")} >
                    &nbsp;
                </div>
            if (isWall) {
                name.push(styles.wall);
            } else if (isSnake) {
                name.push(styles.snake);
            } else if (isbusted) {
                name.push(styles.busted);
            } else if (isApple) {
                name.push(styles.apple);
            } else if (isRock) {
                name.push(styles.rock);
            } else if (isBomb) {
                name.push(styles.bomb);
                return <Bomb key={`item_${j}_${i}`} bombTimer={bombTimer} name={name} gridkey={`item_${j}_${i}`} />
            }
            return <div key={`item_${j}_${i}`} className={name.join(" ")} style={{ flexGrow: 1 }}>&nbsp;</div>
        })

        return <div key={`row_${i}`} className={styles.row} >{rowItems}</div>
    })
    return <div style={frame}>{board}</div>
});

export default GameBoard;

export async function getServerSideProps(context) {
    const snake = randomInteger()
    return {}
}