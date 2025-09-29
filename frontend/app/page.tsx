import HomeController from "@/controllers/HomeController";
import Topbar from "@/components/Topbar";

export default function Home() {
  return (
    <div>
      <Topbar />
      <HomeController />
    </div>
  );
}
