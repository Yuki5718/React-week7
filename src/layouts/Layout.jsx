import { NavLink, Outlet , useNavigate , useLocation } from "react-router-dom"
import { useEffect } from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios';
import Toast from "../component/Toast";
import { useDispatch , useSelector } from 'react-redux';
import { createUserInfo , removeUserInfo } from '../redux/userInfoSlice';
import { createMessage } from '../redux/toastSlice';
import { setScreenLoadingStart , setScreenLoadingEnd } from "../redux/loadingSlice";

const { VITE_BASE_URL } = import.meta.env

const routes = [
  { path: "/", name: "首頁" },
  { path: "/products", name: "產品列表" },
  { path: "/cart", name: "購物車" },
  { path: "/admin" , name: "管理後臺"},
  { path: "/login", name: "登入" },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.userInfo)
  // 全螢幕Loading
  const isScreenLoading = useSelector((state) => state.loading.ScreenLoading.isLoading)

  // 驗證登入
  const checkLogined = async(token) => {
    dispatch(setScreenLoadingStart())
    try {
      const res = await axios.post(`${VITE_BASE_URL}/api/user/check`)
      const { success , uid } = res.data
      
      if (success) {
        dispatch(createUserInfo({
          isAuth: true,
          token,
          uid
        }))

        if (location.pathname === "/") {
          navigate(`/user/${uid}`)
        }
      } else {
        document.cookie = 'hexToken=; max-age=0';
        dispatch(removeUserInfo())
        dispatch(createMessage({
          text: "驗證錯誤，請重新登入",
          status: success ? "success" : "failed"
        }))
        navigate("/login")
      }
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

  // 初始化驗證登入
  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
    if (token !== "") {
      axios.defaults.headers.common['Authorization'] = token;

      if (!userInfo.isAuth) {
        checkLogined(token)
      }
    }
  },[])

  useEffect(() => {
    if ((userInfo.isAuth) && (location.pathname === "/")) {
      navigate(`/user/${userInfo.uid}`)
    }
  },[location])
  
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
            { routes.map((route) => {
              if ((route.path === "/admin") && !userInfo.isAuth) {
                return
              } 
              else if ((route.path === "/login") && userInfo.isAuth) {
                return
              }
              else {
                return (
                  <li
                    key={route.path}
                    className={`nav-item 
                      ${(route.path === "/login") ? ("ms-auto") : ("")}`}
                  >
                    <NavLink
                      to={(userInfo.isAuth && (route.path === "/")) ? (`/user/${userInfo.uid}`) : (route.path)}
                      aria-current="page"
                      className="nav-link fw-bold"
                    >
                      {route.name}
                    </NavLink>
                  </li> 
                )
              }
            })}
            {
              userInfo.isAuth && (
                <li className="nav-item ms-auto">
                  <button className="nav-link fw-bold" onClick={handleLogout}>登出</button>
                </li>)
            }            
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

