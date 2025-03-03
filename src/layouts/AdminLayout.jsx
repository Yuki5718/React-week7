import { NavLink, Outlet } from "react-router-dom"

const routes = [
  {path: "/" , name: "首頁"},

]

export default function AdminLayout () {

  
  return (
    <>
    <h1>後臺導覽列</h1>
    <Outlet></Outlet>
    </>
  )
};