import UseForm from "../hooks/useForm";
import { UserSignInformaiton, validateSignin } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { login, accessToken} = useAuth();
    const navigate = useNavigate();

    useEffect( () => {
        if(accessToken){
            //accessToken이 있으면 (로그인이 되어 있으면) 홈으로 이동
            navigate("/");
        }
    },[navigate,accessToken])

    const { values, errors, touched, getInputProps } =
        UseForm<UserSignInformaiton>({
            initialValue: {
                email: "",
                password: "",
            },
            validate: validateSignin,
        });

    // form 제출 핸들러
    const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        //form 제출 시 페이지가 새로고침되는 것을 막기위한 코드
        e.preventDefault(); // 페이지 리로드 방지
        if (
            Object.values(errors || {}).some((err) => err.length > 0) ||
            Object.values(values).some((v) => v === "")
        ) {
            return;
        }
        await login(values);
    };

    const handleGoogleLogin =async () => {
        window.location.href = 
        import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
    }

    // 버튼 disabled 상태
    const isDisabled: boolean =
        Object.values(errors || {}).some((error: string) => error.length > 0) ||
        Object.values(values).some((value: string) => value === "");

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            {/* form 태그 추가, onSubmit에 submit 핸들러 연결 */}
            <form onSubmit={handleSubmitForm} className="flex flex-col gap-3">
                <input
                    {...getInputProps("email")}
                    name="email"
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-lg ${
                        errors?.email && touched?.email
                            ? "border-red-500 bg-red-200"
                            : "border-gray-300"
                    }`}
                    type="email"
                    placeholder="이메일"
                />
                {errors?.email && touched?.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                )}

                <input
                    {...getInputProps("password")}
                    name="password"
                    className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-lg ${
                        errors?.password && touched?.password
                            ? "border-red-500 bg-red-200"
                            : "border-gray-300"
                    }`}
                    type="password"
                    placeholder="비밀번호"
                />
                {errors?.password && touched?.password && (
                    <div className="text-red-500 text-sm">
                        {errors.password}
                    </div>
                )}

                {/* type을 submit으로 바꾸면 Enter키로도 제출 가능 */}
                <button
                    type="submit"
                    disabled={isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    로그인
                </button>
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={!isDisabled}
                    className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    <div className="flex items-center justify-center">
                        <img src={"/src/images/google.svg"} alt="Google Logo Image"></img>
                        <span>구글 로그인</span>
                    </div>
                    
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
