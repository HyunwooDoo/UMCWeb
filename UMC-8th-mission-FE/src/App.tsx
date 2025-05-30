import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import HomeLayout from "./layouts/HomeLayout";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout";
import GoogleLoginRedirectPage from "./pages/GoogleLoginRedirectPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import LpDetailPage from "./pages/LpDetailPage";
import ThrottlePage from "./pages/ThrottlePage";

// router로 만들어야될 것들
// 1.홈페이지
// 2.로그인 페이지
// 3.회원가입 페이지

//publicRoutes : 인증 없이 접근 가능한 라우트
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      //index값이 true => '/' 경로 일때 보여주는 페이지
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "v1/auth/google/callback", element: <GoogleLoginRedirectPage /> },
      {
        path: "lp/:lpId",
        element: <LpDetailPage />,
      },
      { path: "/throttle", element: <ThrottlePage></ThrottlePage> },
    ],
  },
];
//protectedRoutes : 인증이 필요한 라우트
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "me",
        element: <MyPage />,
      },
    ],
  },
];

const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes,
  // {
  //     path: "/",
  //     element: <HomeLayout />,
  //     errorElement: <NotFoundPage />,
  //     children: [
  //         //index값이 true => '/' 경로 일때 보여주는 페이지
  //         { index: true, element: <HomePage /> },
  //         { path: "login", element: <LoginPage /> },
  //         { path: "signup", element: <SignupPage /> },
  //         { path: "me", element: <MyPage/>},
  //     ],
  // },
]);

export const queryClient = new QueryClient({
  //쿼리에 대한 옵션
  defaultOptions: {
    queries: {
      //재요청을 3번해라
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
