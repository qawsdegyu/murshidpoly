/**
 * Simple prefetch utility for React.lazy components.
 * Calling this will trigger the network request for the component bundle.
 */
export const prefetchPage = (importFn: () => Promise<any>) => {
  importFn().catch(() => {
    /* Ignore errors on prefetch */
  });
};

export const PAGE_IMPORTS = {
  Dashboard: () => import("../pages/Dashboard"),
  Majors: () => import("../pages/Majors"),
  MajorPage: () => import("../pages/MajorPage"),
  Vault: () => import("../pages/Vault"),
  VaultDetail: () => import("../pages/VaultDetail"),
  CoursePage: () => import("../pages/CoursePage"),
  GPACalculator: () => import("../pages/GPACalculator"),
  Faculty: () => import("../pages/Faculty"),
  Marketplace: () => import("../pages/Marketplace"),
  Settings: () => import("../pages/Settings"),
  Recreation: () => import("../pages/Recreation"),
  RecreationCategory: () => import("../pages/RecreationCategory"),
  RecreationDetail: () => import("../pages/RecreationDetail"),
  AnnouncementDetail: () => import("../pages/AnnouncementDetail"),
  BuildingsPage: () => import("../pages/BuildingsPage_v2"),
  NotFound: () => import("../pages/NotFound"),
};
