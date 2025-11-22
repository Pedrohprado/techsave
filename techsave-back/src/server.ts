import app from "./app.js";
import { env } from "./env/index.js";

app.listen({ port: +env.PORT, host: env.HOST }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
  console.log('Docs running at /docs')
});