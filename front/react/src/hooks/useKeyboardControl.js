import React, { useEffect, useState } from "react";

export default function keyboardControl() {
    const keys = {
      KeyW: 'forward',
      KeyS: 'backward',
      KeyA: 'left',
      KeyD: 'right',
    }
  
    const moveFieldByKey = (key) => keys[key]
  
    const [movement, setMovement] = useState({
      forward: false,
      backward: false,
      left: false,
      right: false,
    })
  
    useEffect(() => {
      const handleKeyDown = (e) => {
        setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true}))
        //console.log("KeyDown: " + moveFieldByKey(e.code))
      }
      const handleKeyUp = (e) => {
        setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))
        //console.log("KeyUp: " + moveFieldByKey(e.code))
      }
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
      }
    }, [])
    return movement
}