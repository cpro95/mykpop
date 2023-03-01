import { useState, Fragment } from "react";
import { Switch } from "@headlessui/react";

import { useTranslation } from "react-i18next";

export function ChangeLanguage() {
  const [enabled, setEnabled] = useState(false);
  let { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch.Label className="mx-1 sm:py-2.5 text-xs sm:text-sm">KO</Switch.Label>
        <Switch checked={enabled} onChange={setEnabled} as={Fragment}>
          {({ checked }) => (
            /* Use the `checked` state to conditionally style the button. */
            <button
              onClick={() =>
                checked ? changeLanguage("ko") : changeLanguage("en")
              }
              className={`${
                checked ? "bg-dodger-300" : "bg-dodger-600"
              } relative inline-flex h-5 w-10 text-xs items-center rounded-full`}
            >
              <span
                className={`${
                  checked ? "translate-x-5" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </button>
          )}
        </Switch>
        <Switch.Label className="mx-1 sm:py-2.5 text-xs sm:text-sm">EN</Switch.Label>
      </div>
    </Switch.Group>
  );
}
