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
import bootstrapStyles from "bootstrap/dist/css/bootstrap.css";
import type { MetaFunction, LoaderFunction } from "remix";
import Footer from "~/layout/footer";
import Header from "~/layout/header";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links = () => {
  return [{ rel: "stylesheet", href: bootstrapStyles }];
};

interface LoaderData {
  year: number;
}

export const loader: LoaderFunction = async () => {
  const year = new Date().getFullYear();
  const loaderData: LoaderData = {
    year: year,
  };
  return json(loaderData);
};

export default function App() {
  const { year } = useLoaderData<LoaderData>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Header />

        <div className="container-fluid">
          <Outlet />
        </div>

        <Footer year={year} />

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
