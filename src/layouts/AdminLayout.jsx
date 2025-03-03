import { NavLink, Outlet , useNavigate , useLocation } from "react-router-dom"
import { useEffect } from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios';
import Toast from "../component/Toast";
import { useDispatch , useSelector } from 'react-redux';
import { removeUserInfo } from '../redux/userInfoSlice';
import { createMessage } from '../redux/toastSlice';
import { setScreenLoadingStart , setScreenLoadingEnd } from "../redux/loadingSlice";

const routes = [
  {path: "/admin" , name: "後台首頁"},
  {path: "/admin/productsPage" , name: "產品頁面"},
  {path: "/" , name: "返回前台"}
]

export default function AdminLayout () {

  const userInfo = useSelector((state) => state.userInfo)

  // 全螢幕Loading
  const isScreenLoading = useSelector((state) => state.loading.ScreenLoading.isLoading)

  // 登出功能
  const handleLogout = async() => {
    dispatch(setScreenLoadingStart())
    try {
      await axios.post(`${VITE_BASE_URL}/logout`)
      document.cookie = 'hexToken=; max-age=0';
      document.cookie = 'uid=; max-age=0';
      dispatch(removeUserInfo()) // 移除UserInfo狀態
      navigate("/logout");
    } catch (error) {
      const {success , message} = error.response.data
      dispatch(createMessage({
        text: message,
        status: success ? "success" : "failed"
      }))
    } finally {
      dispatch(setScreenLoadingEnd())
    }
  }
  return (
    <>
      <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
        <div className="container">
          <ul className="navbar-nav flex-row gap-5 fs-5 w-100">
            { routes.map((route) => (
              <li key={(userInfo.isAuth && (route.path === "/")) ? (`/user/${userInfo.uid}`) : (route.path)}
                className={`nav-item ${(route.path === "/login") ? ("ms-auto") : ("")} ${((route.path === "/login") && userInfo.isAuth) ? ("d-none") : ("")}`}>
                <NavLink to={route.path} aria-current="page" className="nav-link fw-bold">{route.name}</NavLink>
              </li>            
            ))}
            { userInfo.isAuth && (<li className="nav-item ms-auto"><button className="nav-link fw-bold" onClick={handleLogout}>登出</button></li>)}            
          </ul>
        </div>
      </nav>

      <Outlet></Outlet>

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
};