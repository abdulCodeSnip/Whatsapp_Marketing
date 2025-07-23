
import { Route, Routes, useNavigate } from 'react-router-dom'
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
import { useEffect } from 'react';


function App() {

  const navigate = useNavigate();
  const tokenFromCookies = Cookies.get("jwtToken");
  useEffect(() => {
    if (!tokenFromCookies) {
      navigate("/login");
    }
  }, [tokenFromCookies]);

  return (
    <>
      <Routes>

        {/* Dashboard Route */}
        <Route
          path="/"
          element={
            <Dashboard />
          } />

        {/* Messages Route */}
        <Route
          path="/messages"
          element={
            <Messages />
          } />

        {/* Templates Route */}
        <Route
          path={"/templates"}
          element={
            <Templates />
          }
        />

        {/* Contacts Route */}
        <Route
          path={"/contacts"}
          element={
            <Contacts />
          }
        />

        {/* Chat History Route */}
        <Route
          path="/chat-history"
          element={
            <ChatHistory />
          } />

        {/* Settings Route */}
        <Route
          path="/settings"
          element={
            <Settings />
          } />

        {/* Create New Template Route */}
        <Route
          path={"/templates/create-new-template"}
          element={
            <CreateNewTemplate />
          } />

        {/* Dynamic Template though this route */}
        <Route
          path={"/templates/:id"}
          element={
            <DynamicTemplate />
          } />

        {/* Import Contacts Route, for importing and processing contacts */}
        <Route
          path={"/import-contacts"}
          element={
            <ImportContacts />
          }
        />

        {/* Send New Message with some information */}
        <Route
          path={"/componse-new-message"}
          element={
            <SendNewMessage />
          }
        />

        {/* Dynamic User to Edit the user */}
        <Route
          path={"/contacts/:id"}
          element={
            <DynamicUser />
          }
        />

        <Route
          path='/login'
          element={<AuthForm />}
        />
      </Routes>
    </>
  )
}

export default App
