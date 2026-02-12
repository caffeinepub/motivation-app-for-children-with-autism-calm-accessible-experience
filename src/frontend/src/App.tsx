import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { SettingsProvider } from './state/SettingsContext';
import { AuthGate } from './components/auth/AuthGate';
import { ProfileSetupModal } from './components/auth/ProfileSetupModal';
import { AppLayout } from './components/layout/AppLayout';
import HomeScreen from './pages/HomeScreen';
import EncouragementScreen from './pages/EncouragementScreen';
import FavoritesScreen from './pages/FavoritesScreen';
import RoutineModeScreen from './pages/RoutineModeScreen';
import SettingsScreen from './pages/SettingsScreen';
import BadgeCelebrationScreen from './pages/BadgeCelebrationScreen';
import BadgesScreen from './pages/BadgesScreen';

const rootRoute = createRootRoute({
  component: () => (
    <SettingsProvider>
      <AuthGate>
        <ProfileSetupModal />
        <AppLayout>
          <Outlet />
        </AppLayout>
      </AuthGate>
    </SettingsProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeScreen,
});

const encouragementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/encouragement',
  component: EncouragementScreen,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/favorites',
  component: FavoritesScreen,
});

const routineModeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/routine',
  component: RoutineModeScreen,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsScreen,
});

const badgeCelebrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/celebration',
  component: BadgeCelebrationScreen,
});

const badgesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/badges',
  component: BadgesScreen,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  encouragementRoute,
  favoritesRoute,
  routineModeRoute,
  settingsRoute,
  badgeCelebrationRoute,
  badgesRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
