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

          {/* Find Jobs menu item */}
          <li className={isActiveLink(findJobItems[0].items[0].routePath, usePathname()) ? "current" : ""}>
            <Link href={findJobItems[0].items[0].routePath}>{findJobItems[0].items[0].name}</Link>
          </li>
          {/* End Find Jobs menu item */}

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

          {/* <li
            className={`${
              isActiveParentChaild(shopItems[0].items, usePathname())
                ? "current "
                : ""
            } dropdown`}
          >
            <span>Shop</span>
            <ul>
              {shopItems.map((item) => (
                <li className="dropdown" key={item.id}>
                  <span
                    className={`${
                      isActiveParentChaild(shopItems[0].items, usePathname())
                        ? "current "
                        : ""
                    }`}
                  >
                    {item.title}
                  </span>
                  <ul>
                    {item.items.map((menu, i) => (
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
              ))}
            </ul>
          </li>
          End Shop menu items */}
        </ul>
      </nav>
    </>
  );
};

export default HeaderNavContent;
