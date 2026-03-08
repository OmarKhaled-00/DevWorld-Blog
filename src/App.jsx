import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ParticlesBackground from "./components/Particles/Particles";
import AppRoutes from "./Routes/AppRoutes";
import ZoomAlert from "./components/ZoomAlert/ZoomAlert";
import "animate.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import TestUpload from "./components/TestUpload/TestUpload";

function App() {
  const queryClient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
            <ParticlesBackground />
            <ZoomAlert />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
      {/* <TestUpload /> */}
    </div>
  );
}

export default App;
