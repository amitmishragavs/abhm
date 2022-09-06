import React, { useEffect, useState } from 'react'
import abdmService from '../../../services/abdm.service'

function ABHMCard() {
  const [file, setfile] = useState<any>("second")
  useEffect(() => {
    abdmService.getProfilePng().then((res: any) => {
      if (res.data) {
        setfile(Buffer.from(res.data, "binary").toString("base64"))
      }
      console.log(res);
    })
  }, [])

  return <div style={{textAlign:"center"}}><img style={{height:"80vh",width:"80vw"}} src={`data:image/png;base64,${file}`} /></div>

}

export default ABHMCard