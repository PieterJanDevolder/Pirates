import Axios, {AxiosRequestConfig} from 'axios'



export interface Credentials {
    username:string,
    password:string
}

interface LoginApiResponse{
    username:string,
    token:string
}


export const onLogin = async (data: Credentials) => {


    const requestConfig : AxiosRequestConfig = {
            method:'post',
            url: process.env.REACT_APP_BACKEND_API + '/Login',
            data        
    }

    try {
        const {data:{token}} = await Axios.request<LoginApiResponse>(requestConfig);
        storeToken(token)
        return{
            token
        }
    } 
    catch (e) {
        return {error:e.response.data}
    }
} 

export const onRegister = async(data : Credentials) => {
    const requestConfig : AxiosRequestConfig = {
        method:'post',
        url: process.env.REACT_APP_BACKEND_API + '/Register',
        data     
    };


    try{
        const {data:response} = await Axios.request(requestConfig)
    }
    catch (e){
        return {error:e.response.data}
    }
}

export const KEY_TOKEN = "KEY_TOKEN";

const storeToken = (token:string) => {
    localStorage.setItem(KEY_TOKEN, token)
}