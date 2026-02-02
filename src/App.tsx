import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from "./pages/Home"
import { Market } from "./pages/Market"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
