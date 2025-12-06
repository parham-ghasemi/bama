import { Outlet } from "react-router-dom"
import Header from "./header/Header"
import SideBar from "./sideBar/SideBar"
import Footer from "../../components/Footer"

const Profile = () => {
  return (
    <div>
      <Header />

      <div className="flex px-16 my-11 gap-8">
        <SideBar />

        <div className="w-full">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Profile