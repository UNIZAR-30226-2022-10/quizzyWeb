import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Solo from './views/solo'
import Menu from './views/menu'
import Shop from './views/shop'
import Collecion from './views/collecion'
import Stats from './views/stats'
import Friends from './views/friends'
import Chat from './components/chat'

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Menu/>} />
      <Route path='/solo/:id' element={<Solo/>} />
      <Route path='/chat/:id' element={<Chat/>} />
      <Route path='/shop' element={<Shop/>} />
      <Route path='/collecion' element={<Collecion/>} />
      <Route path='/stats' element={<Stats/>} />
      <Route path='/friends' element={<Friends/>} />
      
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
            <h1>404 ERROR</h1>
          </main>
        }
      />
    </Routes>
  )
}