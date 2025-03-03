import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Logout () {

  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate("/")
    }, 3000);
  },[])
  
  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-4 text-center pt-5">
            <h1 className="fw-bold mb-5">成功登出</h1>
            <h2>3秒後回到首頁</h2>
          </div>
        </div>
      </div>
    </>
  )
}