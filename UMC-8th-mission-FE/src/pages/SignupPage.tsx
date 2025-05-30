import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { ResponseSignupDto } from "../types/auth";
import { postSignup } from "../apis/auth";
import { useState } from "react";

const schema = z
    .object({
        email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
        password: z
            .string()
            .min(8, {
                message: "비밀번호는 8자 이상이어야 합니다.",
            })
            .max(20, {
                message: "비밀번호는 20자 이하여야 합니다.",
            }),
        passwordCheck: z
            .string()
            .min(8, {
                message: "비밀번호는 8자 이상이어야 합니다.",
            })
            .max(20, {
                message: "비밀번호는 20자 이하여야 합니다.",
            }),
        name: z.string().min(1, { message: "이름을 입력해주세요." }),
    })
    .refine((data) => data.password === data.passwordCheck, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordCheck"],
    });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
    const [step, setStep] = useState(1); //페이지 전환을 위한 useState
    const [showPassword, setShowPassword] = useState(false); // 비밀번호 보이기 토글을 위한 useState
    const [showPasswordCheck, setShowPasswordCheck] = useState(false); // 비밀번호 확인인 보이기 토글을 위한 useState
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        trigger,
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
        mode: "onBlur",
    });

    const email = watch("email");
    const password = watch("password");
    const passwordCheck = watch("passwordCheck");

    // 단계 전환 핸들러
    const handleNext = async (
        field: keyof FormFields | (keyof FormFields)[]
    ) => {
        const valid = await trigger(field);
        const passwordValue = watch("password");
        const passwordCheckValue = watch("passwordCheck");

        if (step === 2 && passwordValue !== passwordCheckValue) {
            return;
        }

        if (valid) setStep(step + 1);
    };

    // 회원가입 완료 핸들러
    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        // console.log(data);
        //역 구조분해 할당 passwordCheck 빼고 나머지 를 다 집어넣는 것.
        const { passwordCheck, ...rest } = data;

        const response: ResponseSignupDto = await postSignup(rest); //API 호출부분
        console.log(response);
        //passwordCheck오류 막으려고 집어넣은 것
        if (!passwordCheck) {
            console.log(passwordCheck);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex flex-col gap-3">
                {/* 타이틀 */}
                <h2 className="text-xl font-bold text-center">회원가입</h2>

                {/* 이메일 표시 (step 2 이상일 때) */}
                {step < 3 &&
                    step > 1 && ( //닉네임 부분에 이메일 로고 나오지 않게 페이지 설정
                        <div className="flex items-center justify-center text-sm text-gray-400">
                            ✉️ {email}
                        </div>
                    )}

                {/* STEP 1: 이메일 입력 */}
                {step === 1 && (
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await handleNext("email");
                        }}
                        className="flex flex-col gap-3"
                    >
                        <button className="border border-gray-500 py-2 rounded">
                            구글 로그인
                        </button>

                        <div className="flex items-center gap-2 text-gray-400">
                            <div className="flex-1 border-b border-gray-700" />
                            <span>OR</span>
                            <div className="flex-1 border-b border-gray-700" />
                        </div>

                        <input
                            {...register("email")}
                            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-lg ${
                                errors?.email
                                    ? "border-blue-300 bg-gray-900"
                                    : "border-gary-300"
                            }`}
                            type={"email"}
                            placeholder={"이메일"}
                        />
                        {errors.email && (
                            <div className={"text-red-500 text-xs"}>
                                {errors.email.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
                        >
                            다음
                        </button>
                    </form>
                )}

                {/* STEP 2: 비밀번호 입력 */}
                {step === 2 && (
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await handleNext(["password", "passwordCheck"]);
                        }}
                        className="flex flex-col gap-3"
                    >
                        <div className="relative w-[300px]">
                            <input
                                {...register("password")}
                                className={`border w-full p-[10px] rounded-lg ${
                                    errors?.password
                                        ? "border-blue-300 bg-gray-900"
                                        : "border-gary-300"
                                }`}
                                type={showPassword ? "text" : "password"}
                                placeholder="비밀번호"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="text-red-500 text-xs">
                                {errors.password.message}
                            </div>
                        )}

                        <div className="relative w-[300px]">
                            <input
                                {...register("passwordCheck")}
                                className={`border w-full p-[10px] rounded-lg ${
                                    errors?.passwordCheck
                                        ? "border-blue-300 bg-gray-900"
                                        : "border-gary-300"
                                }`}
                                type={showPasswordCheck ? "text" : "password"}
                                placeholder={"비밀번호 확인"}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPasswordCheck((prev) => !prev)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                                {showPasswordCheck ? "🙈" : "👁️"}
                            </button>
                        </div>

                        {password &&
                            passwordCheck &&
                            password !== passwordCheck && (
                                <div className="text-red-500 text-xs mt-1">
                                    비밀번호가 일치하지 않습니다.
                                </div>
                            )}

                        <button
                            type="submit"
                            disabled={
                                watch("password") !== watch("passwordCheck") ||
                                isSubmitting
                            }
                            className={`py-2 rounded ${
                                watch("password") !== watch("passwordCheck")
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-pink-500 hover:bg-pink-600"
                            } text-white transition`}
                        >
                            다음
                        </button>
                    </form>
                )}

                {/* STEP 3: 닉네임 */}
                {step === 3 && (
                    <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                    }}
                    className="flex flex-col gap-3"
                    >
                        <input
                            {...register("name")}
                            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-lg ${
                                errors?.name
                                    ? "border-blue-300 bg-gray-900"
                                    : "border-gary-300"
                            }`}
                            type={"name"}
                            placeholder={"이름"}
                        />
                        {errors.name && (
                            <div className={"text-red-500 text-xs"}>
                                {" "}
                                {errors.name.message}{" "}
                            </div>
                        )}
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            className="w-full bg-blue-600 text-white py-3 rounded-md 
    text-lg font-medium hover:bg-blue-700 transition-colors 
    cursor-pointer disabled:bg-gray-300"
                        >
                            회원가입
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SignupPage;
