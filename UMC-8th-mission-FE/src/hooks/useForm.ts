import { ChangeEvent, useEffect, useState } from "react";

interface UseFormProps<T> {
    initialValue: T; // {email :'', password: ''}
    //Record<K,V> 는 키 K의 집합을 값 V로 가지는 객체 타입입
    //값이 올바른지 검증하는 함수
    validate: (values: T) => Record<keyof T, string>; 
}  

function UseForm<T>({ initialValue,validate} :UseFormProps<T>) {
    const [values,setValues] = useState(initialValue);
    const[touched,setTouched] = useState<Record<string,boolean>>();
    const[errors,setErrors] = useState<Record<string,string>>();

    //사용자가 입력값을 바꿀 때 실행되는 함수수
    const handleChange = (name: keyof T,text: string) => {
        setValues( {
            ...values, // 불변성 유지(기존 값 유지)
            [name]: text,
        });
    };
    // 
    const handelBlur = (name:keyof T)=> {
        setTouched( {
            ...touched,
            [name]: true,
        })
    }

    // 이메일 인풋, 패스워드 인풋, 속성들을 좀 가져오는 것
    const getInputProps = (name:keyof T) => {
        const value: T[keyof T] = values[name];
        const onChange = (
            e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
            ) => handleChange(name,e.target.value);

        const onBlur = () => handelBlur(name);
        
        return {value, onChange, onBlur}
    };

    //values가 변경될 때 마다 에러 검증 로직 실행.
    useEffect( () => {
        const newErrors: Record<keyof T,string> = validate(values);
        setErrors(newErrors); // 오류메세지 업데이트트

    },[validate,values])

    return{values, errors, touched, getInputProps};
}

export default UseForm