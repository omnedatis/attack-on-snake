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
  const rows = ranks.data.map((e, idx) => {
    e.teleportOK = e.teleportOK ? 'Yes' : 'No'
    return {"id":idx, ...e}
  })
  return <Dialog open={rankDialogOn} onClose={e => setRankDialogOn(false)}>
    <div style={{ height: '60vmin', width: '70vmin', padding:"10px" }}>
      <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[5, 10, 20]}/>
    </div>
  </Dialog>
}

