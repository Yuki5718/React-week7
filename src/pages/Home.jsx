import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import axios from 'axios';

const { VITE_BASE_URL } = import.meta.env

export default function Home() {
  // 全螢幕Loading
  const [ isScreenLoading , setIsScreenLoading ] = useState(false)
  // 是否登入
  const [ isAuth , setIsAuth ] = useState(false)

  const { id : pageId } = useParams()

  const navigate = useNavigate()

  // 驗證登入
  const checkLogined = async() => {
    setIsScreenLoading(true)
    try {
      const res = await axios.post(`${VITE_BASE_URL}/api/user/check`)
      const { success , uid } = res.data
      // 取得cookie UID
      const cookie_uid = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
      if (success) {
        if (uid !== cookie_uid) {
          document.cookie = `uid=${uid};`; 
        }
        if (uid !== pageId) {
          navigate(`/${uid}`)
        }
        setIsAuth(true)
      } else {
        document.cookie = 'hexToken=; max-age=0';
        document.cookie = 'uid=; max-age=0';
        setIsAuth(false)
        alert("驗證錯誤，請重新登入")
        navigate("/")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsScreenLoading(false)
    }
  }

  useEffect(() => {
    // 取得cookie UID
    const uid = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/,"$1",);

    // 取得cookie TOKEN
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);

    if (token !== "") {
      axios.defaults.headers.common['Authorization'] = token;

      if (!((pageId === uid) && isAuth)) {
        checkLogined()
      }
    } else {
      document.cookie = 'uid=; max-age=0';
      setIsAuth(false)
      if (pageId !== undefined) {
        navigate("*")
      }
    }
  },[ pageId , isAuth ])

  return (
    <>
      <div className="container py-5">
        {isScreenLoading ? (<></>) : (
          <>
            {(isAuth) ? (<h1>歡迎登入，這裡是首頁～</h1>) : (<h1>Hello，這裡是首頁～</h1>)}
          </>
        )}
      </div>

      { isScreenLoading && (<div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.3)",
          zIndex: 999,
        }}
      >
        <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
      </div>)}
    </>
  )
};
