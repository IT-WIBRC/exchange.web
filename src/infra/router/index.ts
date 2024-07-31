import { createWebHistory, createRouter } from "vue-router";
import TheAuthLayout from "@/components/auth/TheAuthLayout.vue";

declare module "vue-router" {
  interface RouteMeta {
    isAdmin?: boolean;
    requiresAuth: boolean;
  }
}

const routes = [
  {
    path: "/",
    component: TheAuthLayout,
    children: [
      {
        path: "",
        name: "registration-form",
        component: () => import("@/components/user/TheRegistrationForm.vue"),
      },
      {
        path: "otp",
        name: "otp-form",
        component: () => import("@/components/user/TheOTP.vue"),
      },
      {
        path: "login",
        name: "login-form",
        component: () => import("@/components/user/TheLogin.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
