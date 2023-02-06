import { useTranslation } from "react-i18next";

export function ChangeLanguage() {
  let { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="rounded-lg p-2.5 text-base font-bold text-gray-500 hover:bg-dodger-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-dodger-700 dark:focus:ring-gray-700">
      {i18n.language === "ko" ? (
        <button onClick={() => changeLanguage("en")}>EN</button>
      ) : (
        <button onClick={() => changeLanguage("ko")}>KO</button>
      )}
    </div>
  );
}
