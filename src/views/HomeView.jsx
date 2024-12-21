import "./HomeView.css"
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import Feature from "../components/Feature.jsx";
import Footer from "../components/Footer.jsx";

function HomeView() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Header />
      <Hero />
      <Feature />
      <Footer />
    </div>
  );
}

export default HomeView;