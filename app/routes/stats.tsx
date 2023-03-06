import { Outlet } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { useTranslation } from "react-i18next";
import type { MetaFunction } from "@remix-run/server-runtime";

export const meta: MetaFunction = () => {
  return {
    title: `통계, Stats, myKPop, KPOP, 케이팝, 마이케이팝`,
    description: `KPOP, 케이팝, 블랙핑크, BLACKPINK, 뉴진스, NewJeans, 르세라핌, LE SSERAFIM`,
  };
};

function Stats() {
  const { t } = useTranslation();

  return (
    <Layout title={t("Stats")!} linkTo="/stats">
      <Outlet />
    </Layout>
  );
}

export default Stats;
