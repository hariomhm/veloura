import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const signAccessToken = (user, sessionId) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role, sid: sessionId },
    env.jwtSecret,
    { expiresIn: env.jwtAccessTtl }
  );

export const signRefreshToken = (user, sessionId) =>
  jwt.sign(
    { sub: user._id.toString(), sid: sessionId },
    env.jwtRefreshSecret || env.jwtSecret,
    { expiresIn: env.jwtRefreshTtl }
  );

export const setAuthCookies = (res, { accessToken, refreshToken }) => {
  const cookieBase = {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    domain: env.cookieDomain || undefined,
    path: "/",
  };

  res.cookie("access_token", accessToken, {
    ...cookieBase,
    maxAge: env.jwtAccessTtlMs,
  });

  res.cookie("refresh_token", refreshToken, {
    ...cookieBase,
    maxAge: env.jwtRefreshTtlMs,
  });
};

export const clearAuthCookies = (res) => {
  const cookieBase = {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    domain: env.cookieDomain || undefined,
    path: "/",
  };
  res.clearCookie("access_token", cookieBase);
  res.clearCookie("refresh_token", cookieBase);
  res.clearCookie("csrf_token", {
    httpOnly: false,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    domain: env.cookieDomain || undefined,
    path: "/",
  });
};

