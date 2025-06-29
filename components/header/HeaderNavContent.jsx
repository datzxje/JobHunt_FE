"use client";

import Link from "next/link";
import {
  blogItems,
  employerItems,
  findJobItems,
  homeItems,
  pageItems,
  shopItems,
} from "../../data/mainMenuData";
import {
  isActiveLink,
  isActiveParentChaild,
} from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";

const HeaderNavContent = () => {
  return (
    <>
      <nav className="nav main-menu">
        <ul className="navigation" id="navbar">
          {/* Home menu item */}
          <li className={isActiveLink(homeItems.routePath, usePathname()) ? "current" : ""}>
            <Link href={homeItems.routePath}>{homeItems.name}</Link>
          </li>
          {/* End homepage menu item */}

          {/* Find Jobs dropdown menu item */}
          <li
            className={`${
              isActiveParentChaild(findJobItems.flatMap(item => item.items), usePathname())
                ? "current "
                : ""
            } dropdown`}
          >
            <span>Find Jobs</span>
            <ul>
              {findJobItems.flatMap(item => item.items).map((menu, i) => (
                <li
                  className={
                    isActiveLink(menu.routePath, usePathname())
                      ? "current"
                      : ""
                  }
                  key={i}
                >
                  <Link href={menu.routePath}>{menu.name}</Link>
                </li>
              ))}
            </ul>
          </li>
          {/* End Find Jobs dropdown menu item */}

          {/* Company menu item */}
          <li className={isActiveLink(employerItems.routePath, usePathname()) ? "current" : ""}>
            <Link href={employerItems.routePath}>{employerItems.name}</Link>
          </li>
          {/* End Company menu item */}

          {/* Blog menu item */}
          <li className={isActiveLink(blogItems.routePath, usePathname()) ? "current" : ""}>
            <Link href={blogItems.routePath}>{blogItems.name}</Link>
          </li>
          {/* End Blog menu item */}

          {/* About menu item */}
          <li className={isActiveLink(pageItems.routePath, usePathname()) ? "current" : ""}>
            <Link href={pageItems.routePath}>{pageItems.name}</Link>
          </li>
          {/* End About menu item */}

        </ul>
      </nav>
    </>
  );
};

export default HeaderNavContent;
