import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux';

export default function NotFound () {
  const navigate = useNavigate()
  const userInfo = useSelector((state) => state.userInfo)

  useEffect(() => {
    setTimeout(() => {
      if (userInfo.isAuth) {
        navigate(`/user/${userInfo.uid}`)
      } else {
        navigate("/")
      }
    }, 3000);
  },[])

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-4 text-center pt-5">
            <h1 className="fw-bold mb-5">查無此頁面</h1>
            <h2>3秒後回到首頁</h2>
          </div>
        </div>
      </div>
    </>
  )
};