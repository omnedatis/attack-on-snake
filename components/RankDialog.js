import { Dialog, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';


export default function RankDialog (props) {
  const rankDialogOn = props.rankDialogOn;
  const setRankDialogOn = props.setRankDialogOn;
  const ranks = props.ranks
  
  const columns = ranks.columns.map(e=>{
    return e
  })
  const rows = ranks.data.map((e, idx)=>{
    return {"id":idx, ...e}
  })
  // const rankBlocks = ranks.map((value ,idx)=>{
  //   return <div key={idx} >{value.name}</div>
  // })
  return <Dialog open={rankDialogOn} onClose={e => setRankDialogOn(false)}>
    <div style={{ height: 400, width: '100%', padding:"10px" }}>
      <DataGrid columns={columns} rows={rows}/>
    </div>
  </Dialog>
}

