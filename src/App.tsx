import { UserProvider } from './Context/UserContext'
import { EventProvider } from './Context/EventContext'
import { Dashboard, Login, Register, CreateEvent, Profile, EventDetails } from './Pages'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
function App() {

  return (
    <UserProvider>
      <EventProvider>
        <BrowserRouter>
          <Routes> 
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/events/:id" element={<EventDetails />} />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </UserProvider>
  )
}

export default App
