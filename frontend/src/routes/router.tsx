import {
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import AppLayout from '../components/layout/AppLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import StocksPage from '../pages/stock/StocksPage';
import OrdersPage from '../pages/sales/OrdersPage';
import CustomersPage from '../pages/customer/CustomersPage';
import ProfilePage from '../pages/profile/ProfilePage';

// ルートレイアウト
const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

// ホームページ
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

// ログインページ
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <div>Login Page</div>,
});

// ユーザー管理
const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: () => <div>Users Page</div>,
});

// 在庫管理
const stocksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stocks',
  component: StocksPage,
});

// 顧客管理
const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: CustomersPage,
});

// 注文管理
const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: () => <div>Orders Page</div>,
});

// 販売管理
const salesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sales',
  component: OrdersPage,
});

// プロファイル
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

// ルートツリーの作成
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  usersRoute,
  stocksRoute,
  customersRoute,
  ordersRoute,
  salesRoute,
  profileRoute,
]);

// ルーターの作成
export const router = createRouter({ routeTree });

// 型安全性のための宣言
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
