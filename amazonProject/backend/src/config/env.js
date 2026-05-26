import dotenv from "dotenv";

dotenv.config();

function optional(name, fallback) {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

function required(name, fallback) {
  const value = optional(name, fallback);
  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const nodeEnv = optional("NODE_ENV", "development");
const jwtSecret = optional("JWT_SECRET", "dev-only-change-me");

if (nodeEnv === "production" && jwtSecret === "dev-only-change-me") {
  throw new Error("JWT_SECRET must be set to a strong value in production");
}

const stripeSecretKey = optional("STRIPE_SECRET_KEY", "");
const stripePublishableKey = optional("STRIPE_PUBLISHABLE_KEY", "");
const stripeWebhookSecret = optional("STRIPE_WEBHOOK_SECRET", "");

function isStripeConfigured(secretKey) {
  return (
    Boolean(secretKey) &&
    secretKey.startsWith("sk_") &&
    !secretKey.includes("replace_me")
  );
}

export const env = {
  nodeEnv,
  isProd: nodeEnv === "production",
  port: Number(optional("PORT", "5001")),
  corsOrigin: optional("CORS_ORIGIN", "http://localhost:5173"),
  allowInstall: optional("ALLOW_INSTALL", "false") === "true",
  db: {
    host: optional("DB_HOST", "localhost"),
    port: Number(optional("DB_PORT", "3306")),
    user: required("DB_USER", "root"),
    password: optional("DB_PASSWORD", ""),
    name: optional("DB_NAME", "amazon_clone"),
  },
  jwt: {
    secret: jwtSecret,
    expiresIn: optional("JWT_EXPIRES_IN", "7d"),
  },
  bcryptRounds: Number(optional("BCRYPT_ROUNDS", "10")),
  stripe: {
    secretKey: stripeSecretKey,
    publishableKey: stripePublishableKey,
    webhookSecret: stripeWebhookSecret,
    isConfigured: isStripeConfigured(stripeSecretKey),
  },
};
