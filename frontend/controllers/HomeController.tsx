import HomeView from "@/views/HomeView";
import Topbar from "@/components/Topbar";

export default function HomeController() {
  return (
    <div>
      <Topbar />
      <HomeView />
    </div>
  );
}
