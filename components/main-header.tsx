import Link from "next/link";
import React from "react";
import logoImg from "@/assets/logo.png";
import Image from "next/image";

const MainHeader = () => {
  return (
    <div>
      <Link href="/" className="flex items-center gap-2">
        <Image
          src={logoImg}
          alt="NextLevel Food Logo"
        />
        <span>NextLevel Food</span>
      </Link>

      <nav>
        <ul>
          <li>
            <Link href="/meals">Browse Meals</Link>
          </li>
          <li>
            <Link href="/community">Foodies Community</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MainHeader;
