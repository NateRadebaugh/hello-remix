import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "react-query";

import Footer from "~/layout/footer";
import Header from "~/layout/header";

import appStyles from "./styles/app.css";
import { getUserSession } from "./session";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  TypedRequest,
} from "./utils/types";
import { json } from "./utils/types";
import { siteTitle } from "config";

const queryClient = new QueryClient();

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;

export const meta: MetaFunction<LoaderData> = () => ({
  charset: "utf-8",
  title: siteTitle,
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: appStyles }];
};

async function getLoaderData<TFormData>(request: TypedRequest<TFormData>) {
  const session = await getUserSession(request);
  const year = new Date().getFullYear();
  return {
    year: year,
    session: session.data,
  };
}

export const loader: LoaderFunction<LoaderData> = async ({ request }) => {
  return json(await getLoaderData(request));
};

export default function App() {
  const { session, year } = useLoaderData<LoaderData>();
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          {!session.securityUser ? (
            <>
              <div className="row">
                <div className="col-sm-10 col-md-8 col-lg-6 col-xl-4 col-xxl-3 border p-3 mx-auto mt-5">
                  <Outlet />
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex flex-column min-vh-100">
              <Header session={session} />

              <main className="col container">
                <Outlet />
              </main>

              <Footer year={year} />
            </div>
          )}

          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </QueryClientProvider>
  );
}
