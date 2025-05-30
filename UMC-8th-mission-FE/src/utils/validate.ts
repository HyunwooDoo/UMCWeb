export type UserSignInformaiton = {
    email: string;
    password: string;
};
// 이메일 형식 & 비밀번호 자리수 검증 함수수
function validateUser(values: UserSignInformaiton){
    const errors : UserSignInformaiton ={
        email:"",
        password: "",
    }

    //이메일 형식 확인인
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i.test(
        values.email,
    )) {
        errors.email = '올바른 이메일 형식이 아닙니다.'
    }
    
    //비밀번호는 8자 20자 사이
    if(!(values.password.length >= 8 && values.password.length < 20)) {
        errors.password = "비밀번호는 8~20자 사이로 입력해주세요."
    }

    return errors;
}

//로그인 유효성 검사
function validateSignin(values: UserSignInformaiton){
    return validateUser(values);
}

export {validateSignin};