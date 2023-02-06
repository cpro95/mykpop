import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  Cog6ToothIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  WrenchIcon,
} from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export default function DropdownMenu({ email }: { email: string | undefined }) {
  const { t } = useTranslation();

  return (
    <Menu as="div" className="relative z-50 inline-block text-left">
      <div>
        <Menu.Button className="mx-1 rounded-lg p-2.5 text-sm text-gray-500 hover:bg-dodger-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-dodger-700 dark:focus:ring-gray-700">
          <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            {email !== undefined ? (
              <>
                <Menu.Item>
                  <p className="p-2 text-center text-sm text-gray-800">
                    {email}
                  </p>
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <form action="/logout" method="post">
                        <button type="submit" className="flex w-full">
                          <ArrowLeftOnRectangleIcon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          {t("Log out")}
                        </button>
                      </form>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <Link to="/admin" className="flex w-full">
                        <WrenchIcon
                          className="mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        {t("Admin")}
                      </Link>
                    </div>
                  )}
                </Menu.Item>
              </>
            ) : (
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-24 items-center rounded-md px-2 py-2 text-sm`}
                  >
                    <Link to="/login" className="flex w-full">
                      <ArrowRightOnRectangleIcon
                        className="mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      {t("Log in")}
                    </Link>
                  </div>
                )}
              </Menu.Item>
            )}
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${
                    active ? "bg-violet-500 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <Link to="/users" className="flex w-full">
                    <CogIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                    {t("Settings")}
                  </Link>
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
