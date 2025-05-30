import { useEffect, useState } from "react";

// 어떤 상태를 받아올지 경우의 수가 여러개 >> Generic으로 받아오기
function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // value나 delay가 변경될 때마다 실행됨
  useEffect(() => {
    // delay(ms) 이후에 실행함
    // delay 시간 후에 value를 debouncedValue로 업데이트 하는 타이머를 시작함
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // value가 변경될 때 기존 타이머를 지워서 업데이트를 취소함. useEffect부수효과 처리 참고
    // 값이 계속 바뀔 때마다 마지막에 멈춘 값만 업데이트 됨
    return () => clearTimeout(handler);
  }, [value, delay]);

  // 최종적으로 잠시 기다린 후의 값을 반환함
  return debouncedValue;
}

export default useDebounce;

/* const [search, setSearch] = useState("")

const debouncedValue = useDebounce(search, 500) // 500ms 후에 동작하게 함 */
