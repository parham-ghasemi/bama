import { Outlet } from "react-router-dom"
import Header from "./header/Header"
import SideBar from "./sideBar/SideBar"

const Profile = () => {
  return (
    <div>
      <Header />

      <div className="flex px-16 my-11 gap-8">
        <SideBar />

        <Outlet />
      </div>
    </div>
  )
}

export default Profile