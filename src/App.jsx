import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Dashboard from "./routes/Dashboard";
import Messages from './routes/Messages';
import Templates from './routes/Templates';
import Contacts from './routes/Contacts';
import ChatHistory from './routes/ChatHistory';
import Settings from './routes/Settings';
import CreateNewTemplate from './routes/Create-New-Template';
import DynamicTemplate from './Components/TemplatesPage/DynamicTemplate';
import ImportContacts from './routes/ImportContacts';
import SendNewMessage from './routes/SendNewMessage';
import DynamicUser from './routes/DynamicUser';
import AuthForm from './Components/Authentication/Login';
import Cookies from 'js-cookie';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const tokenFromCookies = Cookies.get("jwtToken");
  
  if (!tokenFromCookies) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const tokenFromCookies = Cookies.get("jwtToken");
  
  if (tokenFromCookies) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Route - Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthForm />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat-history"
        element={
          <ProtectedRoute>
            <ChatHistory />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/templates/create-new-template"
        element={
          <ProtectedRoute>
            <CreateNewTemplate />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/templates/:id"
        element={
          <ProtectedRoute>
            <DynamicTemplate />
          </ProtectedRoute>
        } 
      />

      <Route
        path="/import-contacts"
        element={
          <ProtectedRoute>
            <ImportContacts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/compose-new-message"
        element={
          <ProtectedRoute>
            <SendNewMessage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contacts/:id"
        element={
          <ProtectedRoute>
            <DynamicUser />
          </ProtectedRoute>
        }
      />

      {/* Catch all route - redirect to login if not authenticated, dashboard if authenticated */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}

export default App