import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { destroySession, getUserSession } from "~/session";

export const action: ActionFunction = async ({ request }) => {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);

  if (!session.has("securityUser")) {
    // Redirect to the home page if they are already signed out.
    return redirect("/");
  }

  return null;
};

export default function Login() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.click();
  }, []);

  return (
    <>
      <Form method="post">
        <button
          ref={buttonRef}
          type="submit"
          name="action"
          value="logout"
          className="btn btn-link nav-link px-2 link-dark"
        >
          Log Out
        </button>
      </Form>
    </>
  );
}
