import "./Hero.css";
import HeroImage from "./hero.png";
import { useNavigate } from "react-router";

function Hero() {
  let navigate = useNavigate();

  return (
    <div className="hero">
      <img src={HeroImage} width={"100%"} height={"700px"}></img>
      <div id="gradient"></div>
      <div className="text">
        <h2 style={{ fontSize: "60px" }}><b>Unlimited movies, TV shows and more</b></h2>
        <p style={{ fontSize: "30px", paddingBottom: "30px" }}>Stream wherever, whenever and however you want</p>
        <p style={{ fontSize: "20px", paddingBottom: "20px" }}>Jump into the action now. Enter your email to create or renew
          your membership</p>

        <div>
          <input id="bar" type="text" placeholder="Email Address"></input>
          <button id="started" onClick={() => navigate("/register")}>Get Started </button>
        </div>

      </div>
    </div>
  );
}

export default Hero;