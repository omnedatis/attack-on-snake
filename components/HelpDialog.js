import { Dialog, Divider } from "@mui/material"
import { useEffect, useState } from "react"
import DontHitRockExample from "./DontHitRockExample"
import DontHitRunExample from "./DontHitRockExample"
import EatAppleExample from "./EatAppleExample"
import GoThrouhghWallExample from "./GoThroughWallExample"

export default function HelpDialog(props) {
    const helpDialogOn = props.helpDialogOn
    const setHelpDialogOn = props.setHelpDialogOn
    const [reRender, setReRender] = useState(0)
    const [dialogRefreash, setDialogRefresh] = useState(0)

    useEffect(e=>{
        const t = setInterval(()=>{
            const count = (reRender+1)%20
            setReRender(count)
        }, 1500)
        return () => clearInterval(t)
    })
    useEffect(e=> setDialogRefresh(dialogRefreash+1), [helpDialogOn])

    return <Dialog open={helpDialogOn} onClose={e => setHelpDialogOn(false)} fullWidth>
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '30px', marginRight: '30px' }}>
            <h2 style={{ margin: '15px', textAlign: 'center' }}>How to play</h2>
            <p>Move your snake to eat apples and grow as long as possible.
            </p>
            <p>Beware of the dangers!</p>
            <Divider />
            <h4>Eat the apples</h4>
            <EatAppleExample reRender={`${reRender}_apple`} key={`${reRender}_apple`}/>
            <h4>Don't hit the rock</h4>
            <DontHitRockExample reRender={`${reRender}_rock`} key={`${reRender}_rock`}/>
            <h4>Go through wall when in teleport mode</h4>
            <GoThrouhghWallExample reRender={`${reRender}_wall`} key={`${reRender}_wall`}/>
            <Divider style={{margin:'10px'}} />
            <h3 style={{textAlign:'center'}}>Good luck!</h3>
        </div>
    </Dialog>
}