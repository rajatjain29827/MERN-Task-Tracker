import Navbar from "./components/Navbar";
import TaskList from "./components/TaskList";
import { NotificationProvider } from "./components/Notification";
import "./App.css";

export default function App() {
  return (
    <NotificationProvider>
      <Navbar />
      <div className="container">
        <TaskList />
      </div>
    </NotificationProvider>
  );
}
