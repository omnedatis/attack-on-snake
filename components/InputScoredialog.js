import { Dialog } from "@mui/material";
import { useState } from "react";

export default function InputScoeDialog (){
  const [isOpen, setIsOpen] = useState(true)
  const handleOnClose = () => setIsOpen(false)
  return  <Dialog open={isOpen} onClose={handleOnClose}> JO</Dialog> 
}