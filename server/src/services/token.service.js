// server/src/services/token.service.js
//
// Pure fabrication (Lecture 4): TokenService has no
// counterpart in the blogging domain, but AuthService needs it to issue
// and verify tokens. This is a minimal stub — see Lecture 15 for a
// hardened version (rotation, revocation, secret management).

import jwt from "jsonwebtoken";

// A02 (Lecture 16): no hardcoded fallback secrets. A missing secret is a
// startup error, not a silent downgrade to a guessable, public string
// that would let anyone forge tokens.
function requireSecret(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set (generate one with: openssl rand -hex 32)`);
  }
  return value;
}

const ACCESS_TOKEN_SECRET = requireSecret("ACCESS_TOKEN_SECRET");
const REFRESH_TOKEN_SECRET = requireSecret("REFRESH_TOKEN_SECRET");

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

export const TokenService = {
  issueTokens(user) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL,
    });

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_TTL,
    });

    return { accessToken, refreshToken };
  },

  verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  },

  verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  },
};
