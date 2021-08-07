import server from "./server";

const app = {
  server: server
}
export type ConfigType = typeof app;
export default app;