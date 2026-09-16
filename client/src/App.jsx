import { RouterProvider } from "react-router-dom";
import appRouter from "./routes/AppRoutes.jsx";

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
