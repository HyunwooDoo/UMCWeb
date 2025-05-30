import { createContext, PropsWithChildren, useContext, useState } from "react";
import { RequestSigninDto, ResponseMyInfoDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { getMyInfo, postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null | undefined;
  refreshToken: string | null | undefined;
  user: ResponseMyInfoDto["data"] | null; //함수가 아니라 유저 정보 상태로
  login: (signInData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  user: null, //null로 초기화
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  //여기 있는navigate는 RouterProvider 안에서 사용할 수 있어서 AuthProvicer에서는 사용 X
  // const navigate = useNavigate();
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null | undefined>(
    getAccessTokenFromStorage()
  );
  const [refreshToken, setRefreshToken] = useState<string | null | undefined>(
    getRefreshTokenFromStorage()
  );

  const [user, setUser] = useState<ResponseMyInfoDto["data"] | null>(null);

  const login = async (singninData: RequestSigninDto) => {
    try {
      const { data } = await postSignin(singninData);

      if (data) {
        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        setAccessTokenInStorage(newAccessToken);
        setRefreshTokenInStorage(newRefreshToken);

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        const myInfoResponse = await getMyInfo();
        setUser(myInfoResponse.data);

        alert("로그인 성공");
        // navigate("/me");
        window.location.href = "/me";
        console.log(data?.accessToken);
        console.log(data?.refreshToken);
      }
    } catch (error) {
      console.error("로그인오류", error);
      alert("로그인 실패");
      // navigate("/home")
    }
  };
  const logout = async () => {
    try {
      await postLogout();
      //AccessToken과 RefreshToken를 제거함함
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();

      //AccessToken과 RefreshToken 값이 null 이면 로그아웃 된 것.
      setAccessToken(null);
      setRefreshToken(null);

      alert("로그아웃 성공");
    } catch (error) {
      console.log("로그아웃 실패", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context: AuthContextType = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }

  return context;
};
