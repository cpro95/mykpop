import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
  useLocation,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getUser } from "./utils/session.server";
import { useTheme, ThemeProvider } from "~/utils/theme-provider";
import type { Theme } from "~/utils/theme-provider";
import { getThemeSession } from "./utils/theme.server";
import invariant from "tiny-invariant";
import { RecoilRoot } from "recoil";

// import { useChangeLanguage } from "remix-i18next";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import { useEffect } from "react";
import * as gtag from "~/utils/gtags.client";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "All About K-Pop",
  description: "K-Pop의 모든 것, All About K-Pop",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  requestInfo: {
    session: {
      theme: Theme | null;
    };
  };
  locale: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  let locale = await i18next.getLocale(request);

  return json<LoaderData>({
    user: await getUser(request),
    requestInfo: {
      session: {
        theme: themeSession.getTheme(),
      },
    },
    locale,
  });
};

export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};

function App({ locale }: { locale: string }) {
  const [theme] = useTheme();
  invariant(theme, "theme must be set");

  const location = useLocation();
  useEffect(() => {
    gtag.pageview(location.pathname, "G-KZHJ0LLR0H");
  }, [location]);

  let { i18n } = useTranslation();

  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()} className={theme}>
      <head>
        <Meta />
        <Links />

        <meta
          name="naver-site-verification"
          content="14f64250bf24454949ee28c13454547324c8f93c"
        />
        <meta name="NaverBot" content="All" />
        <meta name="NaverBot" content="index,follow" />
        <meta name="Yeti" content="All" />
        <meta name="Yeti" content="index,follow" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KZHJ0LLR0H"
        ></script>
        <script
          async
          id="gtag-init"
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-KZHJ0LLR0H', {
                  page_path: window.location.pathname,
                });
              `,
          }}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <RecoilRoot>
      <ThemeProvider specifiedTheme={data.requestInfo.session.theme}>
        <App locale={data.locale} />
      </ThemeProvider>
    </RecoilRoot>
  );
}

export function useChangeLanguage(locale: string) {
  let { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
}

export function ErrorBoundary(props: any) {
  console.log(props.error);
  return (
    <html>
      <head>
        <title>myKpop</title>
        <Meta />
        <Links />
      </head>
      <body>
        <section className="flex h-full items-center bg-gray-50 text-gray-800 sm:p-16">
          <div className="container mx-auto my-8 flex flex-col items-center justify-center space-y-8 px-5 text-center sm:max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-40 w-40 text-gray-400"
            >
              <path
                fill="currentColor"
                d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"
              ></path>
              <rect
                width="176"
                height="32"
                x="168"
                y="320"
                fill="currentColor"
              ></rect>
              <polygon
                fill="currentColor"
                points="210.63 228.042 186.588 206.671 207.958 182.63 184.042 161.37 162.671 185.412 138.63 164.042 117.37 187.958 141.412 209.329 120.042 233.37 143.958 254.63 165.329 230.588 189.37 251.958 210.63 228.042"
              ></polygon>
              <polygon
                fill="currentColor"
                points="383.958 182.63 360.042 161.37 338.671 185.412 314.63 164.042 293.37 187.958 317.412 209.329 296.042 233.37 319.958 254.63 341.329 230.588 365.37 251.958 386.63 228.042 362.588 206.671 383.958 182.63"
              ></polygon>
            </svg>
            <p className="text-3xl">
              Looks like our services are currently offline
            </p>
            <Link
              rel="noopener noreferrer"
              to="/"
              className="rounded bg-blue-600 px-8 py-3 font-semibold text-gray-50"
            >
              Back to homepage
            </Link>
          </div>
        </section>
        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <section className="flex h-full items-center bg-gray-50 p-16 text-gray-800">
          <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
            <div className="max-w-md text-center">
              <h2 className="mb-8 text-9xl font-extrabold text-gray-400">
                <span className="sr-only">Error</span>
                {caught.status}
              </h2>
              <p className="text-2xl font-semibold md:text-3xl">
                {caught.statusText}
              </p>
              <p className="mt-4 mb-8 text-gray-600">
                But dont worry, you can find plenty of other things on our
                homepage.
              </p>
              <Link
                rel="noopener noreferrer"
                to="/"
                className="rounded bg-blue-600 px-8 py-3 font-semibold text-gray-50"
              >
                Back to homepage
              </Link>
            </div>
          </div>
        </section>

        <Scripts />
      </body>
    </html>
  );
}
