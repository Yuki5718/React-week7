import { NavLink, Outlet , useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios';
import Toast from "../component/Toast";

const { VITE_BASE_URL } = import.meta.env

const routes = [
  { path: "/", name: "首頁" },
  { path: "/products", name: "產品列表" },
  { path: "/cart", name: "購物車" },
  { path: "/login", name: "登入" },
  { path: "/admin" , name: "管理後臺"}
];

export default function Layout() {
  // 全螢幕Loading
  const [ isScreenLoading , setIsScreenLoading ] = useState(false)
  // 是否登入
  const [ isAuth , setIsAuth ] = useState(false)
  // user id
  const [ userId , setUserId ] = useState("")

  let { id : pageId } = useParams()

  useEffect(() => {
    const uid = document.cookie.replace(/(?:(?:^|.*;\s*)uid\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
    if (pageId === uid) {
      setUserId(uid)
      setIsAuth(true)
    }
  },[ pageId ])
  
  const navigate = useNavigate()

  const handleLogout = async() => {
    setIsScreenLoading(true)
    try {
      await axios.post(`${VITE_BASE_URL}/logout`)
      document.cookie = 'hexToken=; max-age=0';
      document.cookie = 'uid=; max-age=0';
      setIsAuth(false)
      navigate("/logout");
    } catch (error) {
      console.log(error)
      alert("登出失敗")
    } finally {
      setIsScreenLoading(false)
    }
  }

  return (
    <>
      <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container">
          <ul className="navbar-nav flex-row gap-5 fs-5 w-100">
            { routes.map((route) => (
              <li key={(isAuth && (route.path === "/")) ? (userId) : (route.path)}
                className={`nav-item ${(route.path === "/login") ? ("ms-auto") : ("")} ${((route.path === "/login") && isAuth) ? ("d-none") : ("")}`}>
                <NavLink to={(isAuth && (route.path === "/")) ? (userId) : (route.path)} aria-current="page" className="nav-link fw-bold">{route.name}</NavLink>
              </li>            
            ))}
            { isAuth && (<li className="nav-item ms-auto"><button className="nav-link fw-bold" onClick={handleLogout}>登出</button></li>)}            
          </ul>
        </div>
      </nav>
      <Outlet />

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

      <Toast />
    </>
  )
}

