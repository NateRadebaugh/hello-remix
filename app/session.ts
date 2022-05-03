import type { Session as RawSession } from "@remix-run/node";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { authenticateSecurityUser } from "./models/securityUser.server";
import type { TypedRequest } from "./utils/types";

// somewhere you've got a session storage
const {
  getSession,
  commitSession: rawCommitSession,
  destroySession: rawDestroySession,
} = createCookieSessionStorage({
  cookie: {
    name: "__session",

    //expires: new Date(Date.now() + 60_000),
    httpOnly: true,
    //maxAge: 60,
    path: "/",
    sameSite: "strict",
    secrets: ["s3cret1"],
    secure: true,
  },
});

export interface SessionData {
  securityUser:
    | Awaited<ReturnType<typeof authenticateSecurityUser>>["securityUser"]
    | undefined;
}

export interface Session extends Omit<RawSession, "data" | "get" | "set"> {
  data: SessionData;

  has: <T extends keyof SessionData>(name: T) => boolean;
  get: <T extends keyof SessionData>(name: T) => SessionData[T];
  set: <T extends keyof SessionData>(name: T, newValue: SessionData[T]) => void;
}

export async function getUserSession(request: TypedRequest): Promise<Session> {
  // get the session
  const cookie = request.headers.get("cookie");
  const session = await getSession(cookie);

  return session as Session;
}

export async function requireUserSession(request: TypedRequest): Promise<Session> {
  // get the session
  const session = await getUserSession(request);

  // validate the session, `userId` is just an example, use whatever value you
  // put in the session when the user authenticated
  if (!session.has("securityUser")) {
    // if there is no user session, redirect to login
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw redirect("/login");
  }

  return session;
}

export async function commitSession(session: Session) {
  return rawCommitSession(session);
}

export async function destroySession(session: Session) {
  return rawDestroySession(session);
}
