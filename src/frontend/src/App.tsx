import { Layout } from "@/components/Layout";
import { CreateCapsulePage } from "@/pages/CreateCapsulePage";
import { HomePage } from "@/pages/HomePage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const createCapsuleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create",
  component: CreateCapsulePage,
});

const routeTree = rootRoute.addChildren([homeRoute, createCapsuleRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
