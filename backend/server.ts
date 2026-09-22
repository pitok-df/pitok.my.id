import { app } from "./src/index";
import { env } from "./src/env";

// Vercel serverless: export fetch handler (no port binding)
// Local dev: start HTTP server
if (!process.env.VERCEL) {
	app.listen(env.PORT);
}

export default app;
