import { useState } from "react";
import { Link } from "@remix-run/react";
import { DarkMode } from "./dark-mode";
import DropdownMenu from "./dropdown-menu";
import { useTranslation } from "react-i18next";
// import { ChangeLanguage } from "./change-language";

export function Headers({
  title,
  linkTo,
  email,
}: {
  title?: string | null;
  linkTo?: string;
  email?: string;
}) {
  const [show, setShow] = useState<boolean>(true);

  const { t } = useTranslation();
  const home: { to: string; name: string } = {
    to: "/",
    name: "myKPop",
  };

  const links: { to: string; name: string }[] = [
    {
      to: "/mv",
      name: t("MV"),
    },
    {
      to: "/stats",
      name: t("Stats"),
    },
    {
      to: "/notes",
      name: t("Notes"),
    },
  ];
  const linkStyle =
    "transform p-2.5 text-gray-600 transition-colors duration-200 hover:text-gray-700 focus:text-gray-700 focus:outline-none dark:text-gray-200 dark:hover:text-gray-400 dark:focus:text-gray-400 md:block";

  return (
    <nav>
      <div className="container mx-auto px-4 py-2">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold text-gray-700">
              <Link
                to={home.to}
                className="transform text-2xl font-bold text-gray-800 transition-colors duration-200 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 lg:text-3xl"
              >
                {home.name}
              </Link>
              <span className="display border-gray-100 py-2 pr-4 pl-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:hidden md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-dodger-700 md:dark:hover:bg-transparent md:dark:hover:text-white">
                {title ? (
                  <Link
                    to={linkTo ? linkTo : "."}
                    className="transform text-sm font-bold text-gray-800 transition-colors duration-200 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                  >
                    {title}
                  </Link>
                ) : (
                  ""
                )}
              </span>
            </div>

            {/* <!-- Mobile menu button --> */}
            <div className="flex items-center justify-evenly md:hidden">
              {/* <ChangeLanguage /> */}
              <DarkMode />
              <DropdownMenu email={email} />
              <button
                type="button"
                className="rounded-lg sm:p-2.5 text-sm text-gray-500 hover:bg-dodger-100 hover:text-gray-600 focus:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:bg-dodger-700 dark:hover:text-gray-400 dark:focus:text-gray-400"
                aria-label="toggle menu"
                onClick={() => {
                  setShow(!show);
                }}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className={`${show ? "hidden" : ""} h-6 w-6`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <svg
                  className={`${!show ? "hidden" : ""} h-6 w-6`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          {/* <!-- Mobile Menu open: "block", Menu closed: "hidden" --> */}
          <div
            className={`${
              !show ? "hidden" : ""
            } flex-1 md:flex md:items-center md:justify-between`}
          >
            <ul className="flex flex-row md:mx-8 md:flex-row md:items-center">
              {links.map((link) => (
                <li key={link.to} className="my-2">
                  <Link to={link.to} className={linkStyle}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 -mx-4 hidden items-center text-gray-700 dark:text-gray-300 md:mt-0 md:flex">
              {/* <ChangeLanguage /> */}
              <DarkMode />
              {/* <ReachMenu email={email} /> */}
              <DropdownMenu email={email} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
