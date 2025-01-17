import "./ErrorView.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router";

function ErrorView() {
  const navigate = useNavigate();
  return (
    <div>
      <Header />
      <div className="message">
        <h1>This page does not exist!</h1>
        <button onClick={() => navigate("/")}>Return Home</button>
      </div>
      <Footer />
    </div>

  );
}

export default ErrorView;