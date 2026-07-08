import mitra1 from "../assets/images/mitra1.png";
import "./Header.css";

function Header() {
  return (
    <header className="hero" style={{ backgroundImage: `url(${mitra1})` }}>
      <div className="hero-content"></div>
    </header>
  );

  // return (
  //   <div className="head-div">
  //     <img src={mitra1} alt="ToDo Mitra Banner" className="header-image" />
  //   </div>
  // );
}

export default Header;
