import Link from "next/link";
import useWindowSize from "../../utils/hooks/useWindowSize";
import styles from "./styles.module.css";

const DesktopNavbar = () => {
  const { width } = useWindowSize();
  if (!width || width < 640) {
    return <></>;
  }

  return (
    <nav className={`${styles.navbar || ""} h-24`}>
      <div className="fixed top-0 flex h-24 w-screen items-center justify-between bg-black/70 px-4 text-2xl text-white backdrop-blur-md">
        <Link href="/">RCBible</Link>
        <ul className="flex gap-4">
          <li>
            <Link href="/bible">Bible</Link>
          </li>
          {/* <li>
          <Link href="/catechism">Catechism</Link>
        </li>
        <li>
          <Link href="/other">Other</Link>
        </li>
        <li>
          <Link href="/auth">Log In</Link>
        </li> */}
        </ul>
      </div>
    </nav>
  );
};

const MobileNavbar = () => {
  const { width } = useWindowSize();
  if (!width || width >= 640) {
    return (
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
            <Link href="/">Bible</Link>
          </li>
        </ul>
      </nav>
    );
  }

  return <nav></nav>;
};

const Navbar = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <>
      <DesktopNavbar />
      {children}
      <MobileNavbar />
    </>
  );
};

export default Navbar;
