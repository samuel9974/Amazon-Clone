import { env } from "../config/env.js";
import { runDatabaseInstall } from "../services/install.service.js";
import { HttpError } from "../utils/httpError.js";

function assertInstallAllowed() {
  if (env.isProd && !env.allowInstall) {
    throw new HttpError(
      403,
      "Install is disabled in production. Set ALLOW_INSTALL=true only for controlled setups.",
    );
  }
}

export async function installDatabase(req, res) {
  assertInstallAllowed();
  const result = await runDatabaseInstall();
  res.status(201).json({
    message: "Database created and seeded successfully.",
    ...result,
    next: "Open http://localhost:5173 — products load from MySQL via /api/products",
  });
}
