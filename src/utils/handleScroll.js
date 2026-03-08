function handleScroll(setIsHidden, setIsDefault) {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    setIsDefault?.(currentScrollY === 0);

    // scrolling down → hide
    if (currentScrollY > lastScrollY) {
      setIsHidden(true);
    }
    // scrolling up → show
    else {
      setIsHidden(false);
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}

export default handleScroll;
