import { useState, useEffect } from "react";
import { FaCircleChevronUp } from "react-icons/fa6";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // スクロール位置を監視して表示・非表示を切り替える
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // ページの一番上へスムーススクロールで戻る
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    // コンポーネントのアンマウント時にイベントリスナーを解除する
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button className="scroll-to-top-btn" onClick={scrollToTop} aria-label="トップへ戻る">
      <FaCircleChevronUp size={44} />
    </button>
  );
};

export default ScrollToTop;
