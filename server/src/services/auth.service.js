// server/src/services/auth.service.js
//
// Implements processing narratives exactly, in order.

import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository.js";
import { assertNonEmpty, ValidationError } from "../utils/validation.js";
import { TokenService } from "./token.service.js";
import { logger } from "../lib/logger.js";

class EmailAlreadyRegisteredError extends Error {}
class WeakPasswordError extends Error {}
class InvalidCredentialsError extends Error {}

// Section 4.5's "Magic Numbers" anti-pattern, corrected: the bcrypt
// cost factor and minimum password length are named constants,
// not bare literals a future reader would have to guess the meaning of.
const BCRYPT_COST_FACTOR = 10; // see Lecture 15 for the security tradeoff this number encodes
const MIN_PASSWORD_LENGTH = 8;

// The caller's OWN account (register/login responses): includes email,
// never passwordHash. Other users are shaped by dto/user.dto.js's
// stricter toPublicUser (Lecture 15).
function toOwnAccountUser({ id, email, displayName }) {
  return { id, email, displayName };
}

export const AuthService = {
  async register({ email, displayName, password }) {
    assertNonEmpty(email, "email", "MISSING_EMAIL");
    assertNonEmpty(displayName, "displayName", "MISSING_DISPLAY_NAME");
    assertNonEmpty(password, "password", "MISSING_PASSWORD");

    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyRegisteredError();
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new WeakPasswordError();
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST_FACTOR);

    let user;
    try {
      user = await UserRepository.create({ email, displayName, passwordHash });
    } catch (err) {
      // Defense in depth (Lecture 4): the DB's @unique
      // constraint may reject a race-condition duplicate that slipped
      // past the check above.
      throw new EmailAlreadyRegisteredError();
    }

    const tokens = TokenService.issueTokens(user);
    return { user: toOwnAccountUser(user), ...tokens };
  },

  async login({ email, password }) {
    assertNonEmpty(email, "email", "MISSING_EMAIL");
    assertNonEmpty(password, "password", "MISSING_PASSWORD");

    const user = await UserRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      // A09's fix: a failed login is a structured, leveled, machine-
      // parseable event (searchable by "event" or "email" once aggregated),
      // not a silent failure only the requester ever sees. Never log the
      // password. Same error either way, so callers can't tell which half
      // was wrong.
      logger.warn({ event: "auth.login.failed", email }, "Failed login attempt");
      throw new InvalidCredentialsError();
    }

    const tokens = TokenService.issueTokens(user);
    return { user: toOwnAccountUser(user), ...tokens };
  },
};

export { EmailAlreadyRegisteredError, WeakPasswordError, InvalidCredentialsError, ValidationError };
