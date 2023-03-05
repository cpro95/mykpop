import {
  Outlet,
} from "@remix-run/react";
import { Layout } from "~/components/layout";
import { useTranslation } from "react-i18next";

function Stats() {
  const { t } = useTranslation();

  return (
    <Layout title={t("Stats")!} linkTo="/stats">
      <Outlet />
    </Layout>
  );
}

export default Stats;
