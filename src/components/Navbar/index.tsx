import Link from "next/link";
import useWindowSize from "../../utils/hooks/useWindowSize";
import styles from "./styles.module.css";
import { useState } from "react";
import { HomeIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon as SolidHomeIcon,
  BookOpenIcon as SolidBookOpenIcon,
} from "@heroicons/react/24/solid";

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

const MobileLink = ({
  link,
  selected,
  onClick,
}: {
  link: {
    href: string;
    icon: JSX.Element;
    selectedIcon: JSX.Element;
  };
  selected: boolean;
  onClick: () => void;
}) => {
  const { href, icon, selectedIcon } = link;
  return (
    <Link href={href} onClick={onClick}>
      {selected ? selectedIcon : icon}
    </Link>
  );
};

const MobileNavbar = () => {
  const mobileLinks = [
    {
      name: "Home",
      href: "/",
      icon: <HomeIcon className="h-12 text-slate-100" />,
      selectedIcon: <SolidHomeIcon className="h-12 text-slate-100" />,
    },
    {
      name: "Bible",
      href: "/bible",
      icon: <BookOpenIcon className="h-12 text-slate-100" />,
      selectedIcon: <SolidBookOpenIcon className="h-12 text-slate-100" />,
    },
  ];
  const [currentPage, setCurrentPage] = useState("");
  return (
    <nav className="fixed bottom-0 h-24 w-full bg-slate-900">
      <ul className="flex flex-row justify-between gap-2 py-4 px-6 w-full">
        {mobileLinks.map((link) => {
          return (
            <li key={link.href}>
              <MobileLink
                link={link}
                selected={currentPage === link.name}
                onClick={() => {
                  setCurrentPage(link.name);
                }}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

const Navbar = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  const { width } = useWindowSize();
  return (
    <>
      <DesktopNavbar />
      <div className={`${width && width <= 640 ? "mb-24" : ""}`}>
        {children}
      </div>
      {width && width <= 640 && <MobileNavbar />}
    </>
  );
};

export default Navbar;
