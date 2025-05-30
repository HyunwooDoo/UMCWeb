export const useLocalStorage = (key: string) => {
    const setItem = (value: string) => {
        try {
            window.localStorage.setItem(key, value);
            // value값을 JSON.stringify(value)로 하게되면 겹따움표 ""토큰값"" 의 문제가 생길 수 있어서 그냥 value값을 그대로 사용함.
        } catch (error) {
            console.log(error);
        }
    };

    
    const getItem = () => {
        try {
            const item = window.localStorage.getItem(key);

            return item ? item : null; 
            // return item ? JSON.parse(item) : null;
            // 이 부분에서 오류 발생
            //저번에 set할떄 JSON으로 안받고 그냥 토큰값 그 자체로 받아서 get할떄도 JSON을 문자열로 변환할 필요없이 item값을 그대로 받아오면 됨.
        } catch (e) {
            console.log(e);
        }
    };

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.log(error);
        }
    };



    return {setItem, getItem, removeItem};
};
