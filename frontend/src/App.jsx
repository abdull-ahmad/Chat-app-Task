import { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from './store/authStore';
import { Toaster } from "react-hot-toast";
import RegisterPage from './pages/auth/RegisterPage';
import ChatPage from './pages/chat/ChatPage';
import LoadingSpinner from './components/LoadingSpinner';
import LoginPage from './pages/auth/LoginPage';


const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }
  return <>{children}</>;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  const publicRoutes = [
    { path: "/register", element: <RegisterPage />, wrapper: AuthRedirect },
    { path: "/login", element: <LoginPage />, wrapper: AuthRedirect },
  ];

  const protectedRoutes = [
    { path: "/chat", element: <ChatPage /> },
  ];

  return (
    <div>
      <Routes>
        {publicRoutes.map(({ path, element, wrapper: Wrapper }) => (
          <Route
            key={path}
            path={path}
            element={Wrapper ? <Wrapper>{element}</Wrapper> : element}
          />
        ))}
        {protectedRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<RequireAuth>{element}</RequireAuth>}
          />
        ))}
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
