import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { MetaFunction, LoaderFunction } from "remix";
import { QueryClient, QueryClientProvider } from "react-query";

import Footer from "~/layout/footer";
import Header from "~/layout/header";

import bootstrapStyles from "bootstrap/dist/css/bootstrap.css";

const queryClient = new QueryClient();

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links = () => {
  return [{ rel: "stylesheet", href: bootstrapStyles }];
};

type LoaderData = Awaited<ReturnType<typeof getLoaderData>>;

async function getLoaderData() {
  const year = new Date().getFullYear();
  return {
    year: year,
  };
}

export const loader: LoaderFunction = async () => {
  return json(await getLoaderData());
};

export default function App() {
  const { year } = useLoaderData<LoaderData>();
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <Header />

          <main className="container-fluid">
            <Outlet />
          </main>

          <Footer year={year} />

          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </QueryClientProvider>
  );
}
