const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../db");

const {
  JWT_SECRET = "change_this_secret",
  JWT_EXPIRES = "7d"
} = process.env;

// Helpers
const signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const clearTokenCookie = (res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax"
  });
};

// Dynamic user column detection
let cachedUserColumns = null;
async function getUserColumns() {
  if (cachedUserColumns) return cachedUserColumns;
  try {
    const rows = await query(
      "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?",
      [process.env.DB_NAME, "users"]
    );
    cachedUserColumns = new Set(rows.map((r) => r.COLUMN_NAME));
  } catch (e) {
    cachedUserColumns = new Set([
      "id",
      "email",
      "password_hash",
      "is_active",
      "created_at"
    ]);
  }
  return cachedUserColumns;
}

async function getUserByEmail(email) {
  const cols = await getUserColumns();
  const qCols = ["id", "email", "password_hash"].filter((c) =>
    cols.has(c)
  );
  const rows = await query(
    `SELECT ${qCols.join(", ")} FROM users WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows[0];
}

async function getUserById(id) {
  const cols = await getUserColumns();
  const desired = [
    "id",
    "email",
    "is_active",
    "created_at",
    "full_name",
    "address_line1",
    "address_line2",
    "city",
    "state",
    "postal_code",
    "country",
    "phone"
  ];
  const select = desired.filter((c) => cols.has(c));
  if (!select.length) select.push("id", "email");
  const rows = await query(
    `SELECT ${select.join(", ")} FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0];
}

// ==================== CONTROLLERS ====================
async function signup(req, res, next) {
  try {
    const {
      email,
      password,
      full_name,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      phone,
      promo
    } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    if (await getUserByEmail(email))
      return res.status(409).json({ error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const cols = await getUserColumns();

    const insertCols = [],
      placeholders = [],
      values = [];
    if (cols.has("email")) {
      insertCols.push("email");
      placeholders.push("?");
      values.push(email);
    }
    if (cols.has("password_hash")) {
      insertCols.push("password_hash");
      placeholders.push("?");
      values.push(hash);
    }
    if (cols.has("is_active")) {
      insertCols.push("is_active");
      placeholders.push("?");
      values.push(1);
    }
    if (cols.has("full_name") && full_name !== undefined) {
      insertCols.push("full_name");
      placeholders.push("?");
      values.push(full_name || null);
    }
    if (cols.has("address_line1") && address_line1 !== undefined) {
      insertCols.push("address_line1");
      placeholders.push("?");
      values.push(address_line1 || null);
    }
    if (cols.has("address_line2") && address_line2 !== undefined) {
      insertCols.push("address_line2");
      placeholders.push("?");
      values.push(address_line2 || null);
    }
    if (cols.has("city") && city !== undefined) {
      insertCols.push("city");
      placeholders.push("?");
      values.push(city || null);
    }
    if (cols.has("state") && state !== undefined) {
      insertCols.push("state");
      placeholders.push("?");
      values.push(state || null);
    }
    if (cols.has("postal_code") && postal_code !== undefined) {
      insertCols.push("postal_code");
      placeholders.push("?");
      values.push(postal_code || null);
    }
    if (cols.has("country") && country !== undefined) {
      insertCols.push("country");
      placeholders.push("?");
      values.push(country || null);
    }
    if (cols.has("phone") && phone !== undefined) {
      insertCols.push("phone");
      placeholders.push("?");
      values.push(phone || null);
    }
    if (cols.has("promo") && promo !== undefined) {
      insertCols.push("promo");
      placeholders.push("?");
      values.push(promo ? 1 : 0);
    }

    const sql = `INSERT INTO users (${insertCols.join(
      ","
    )}) VALUES (${placeholders.join(",")})`;
    const [result] = await query(sql, values);

    const newUser = await getUserById(result.insertId);
    const token = signToken({ sub: newUser.id, email: newUser.email });
    setTokenCookie(res, token);

    res.status(201).json({ user: newUser });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const row = await getUserByEmail(email);
    if (!row) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, row.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const user = await getUserById(row.id);
    const token = signToken({ sub: user.id, email: user.email });
    setTokenCookie(res, token);

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  clearTokenCookie(res);
  res.json({ ok: true });
}

async function me(req, res) {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(payload.sub);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { signup, login, logout, me };
