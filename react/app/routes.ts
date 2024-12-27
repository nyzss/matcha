import {
    type RouteConfig,
    index,
    layout,
    route,
} from "@react-router/dev/routes";

export default [
    layout("components/layout/app-layout.tsx", [
        index("routes/home.tsx"),
        layout("routes/protected.tsx", [
            route("profile", "routes/profile.tsx"),
        ]),
    ]),
    layout("components/layout/auth-layout.tsx", [
        route("login", "routes/[auth]/login.tsx"),
        route("register", "routes/[auth]/register.tsx"),
    ]),
] satisfies RouteConfig;
