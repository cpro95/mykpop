import type {  MetaFunction } from "@remix-run/node";

import { Layout } from "~/components/layout";

export const meta: MetaFunction = (props) => {
  return {
    title: "All About KPop",
    description: "KPop의 모든 것, All About KPop",
  };
};

export default function Index() {
  return (
    <Layout>
      <div className="relative w-full rounded-lg shadow-xl sm:overflow-hidden lg:w-10/12 dark:text-white">
        Hello! All About Kpop
      </div>
    </Layout>
  );
}
