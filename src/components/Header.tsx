import { useState } from "react";
import { Link } from "react-router-dom";
import { BiMenu, BiX } from "react-icons/bi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="app-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* ハンバーガーボタン */}
          <button className="hamburger-btn" onClick={toggleMenu}>
            <BiMenu size={26} />
          </button>

          <h1 style={{ marginLeft: "12px" }}>
            <Link to="/" onClick={closeMenu}>
              セットリスト検索
            </Link>
          </h1>
        </div>
      </header>

      {/* 背景オーバーレイ（メニューが開いている時だけ表示） */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

      {/* サイドメニュー */}
      <nav className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="side-menu-header">
          <h2>メニュー</h2>
          <button className="close-btn" onClick={closeMenu}>
            <BiX size={28} />
          </button>
        </div>
        <div className="side-menu-links">
          <Link to="/" onClick={closeMenu}>
            セットリスト検索
          </Link>
          <Link to="/ranking" onClick={closeMenu}>
            披露回数ランキング
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;
