import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import HomeView from "./views/HomeView.jsx";
import RegisterView from "./views/RegisterView.jsx";
import LoginView from "./views/LoginView.jsx";
import MoviesView from "./views/MoviesView.jsx";
import GenreView from "./views/GenreView.jsx";
import DetailView from "./views/DetailView.jsx";
import CartView from "./views/CartView.jsx";
import SettingsView from "./views/SettingsView.jsx";
import { StoreProvider } from "./context";

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/movies" element={<MoviesView />}>
            <Route path="genre/:id" element={<GenreView />} />
            <Route path="details/:id" element={<DetailView />} />
          </Route>
          <Route path="/cart" element={<CartView/>}/>
          <Route path="/settings" element={<SettingsView/>}/>
        </Routes>
      </BrowserRouter>
    </StoreProvider>

  )
}

export default App;
