// src/App.js
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import Sidebar from './components/NavBar';
import TopBar from './components/TopBar';
import Dashboard from './components/pages/Dashboard.jsx';
import Feedback from './components/pages/Feedback.jsx';
import Reports from './components/pages/Reports.jsx';
import Documents from './components/pages/Documents.jsx';
import Login from './components/pages/Login.jsx';
import ShowAds from "./components/pages/ShowAds.jsx"
import { Box } from '@mui/material';
import store, { persistor } from './store/store.js'; // Import store and persistor
import { setUser } from './store/userSlice.js'; // Adjust the path if necessary
import { Toaster, toast } from 'react-hot-toast'; 
import PasswordChange from './components/pages/PasswordChange.jsx';
import Advertisement from './components/pages/Advertisement.jsx';
import ResetPassword from './components/pages/ResetPassword.jsx';

const PrivateRoute = ({ isLogin, children }) => {
  return isLogin ? children : <Navigate to="/login" replace />;
};

const AppContent = ({ isLogin, handleLogout }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin && window.location.pathname !== '/login' && window.location.pathname !== '/reset-password') {
      navigate('/login');
    }
  }, [isLogin, navigate]);
  

  return (
    <>
      {isLogin && <Sidebar />}
      {isLogin && <TopBar onLogout={handleLogout} />}
      <Box
        sx={{
          marginLeft: isLogin ? '20%' : 0,
          marginTop: isLogin ? '64px' : 0,
          padding: 3,
          bgcolor: 'background.default',
          height: isLogin ? 'calc(100vh - 64px)' : '100vh',
        }}
      >
        <Routes>
          <Route
            path="/login"
            element={isLogin ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/"
            element={
              <PrivateRoute isLogin={isLogin}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute isLogin={isLogin}>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute isLogin={isLogin}>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <PrivateRoute isLogin={isLogin}>
                <Documents />
              </PrivateRoute>
            }
          />
          <Route
            path="/showAds"
            element={
              <PrivateRoute isLogin={isLogin}>
                <ShowAds />
              </PrivateRoute>
            }
          />
          <Route
            path="/advertisement"
            element={
              <PrivateRoute isLogin={isLogin}>
                <Advertisement />
              </PrivateRoute>
            }
          />
          <Route
          path="/changePassword"
          element={
            <PrivateRoute isLogin={isLogin}>
              <PasswordChange />
            </PrivateRoute>
          }
        />

        <Route 
        path="/reset-password" 
        element={<ResetPassword/>} />
        </Routes>
      </Box>
    </>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user.isUser); // Select the isUser state from Redux

  // Handle logout API call
  const handleLogout = async () => {
    try {
      const response = await fetch('http://52.66.210.195:3000/admin/logout', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Logout successful');
        dispatch(setUser(false));
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('An error occurred while logging out. Please try again.');
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppContent isLogin={userState} handleLogout={handleLogout} />
        </Router>
      </PersistGate>
      <Toaster position="top-center" reverseOrder={false} /> 

    </Provider>
  );
};

export default App;
