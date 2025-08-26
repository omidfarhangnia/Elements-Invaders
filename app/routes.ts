import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/device-manager.tsx", [
    index("./routes/home.tsx"),
    route("/levels", "./routes/levels.tsx"),
    route("/battleground", "./routes/battleground.tsx"),
  ]),
] satisfies RouteConfig;
