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
            url: process.env.REACT_APP_BACKEND_API + '/api/user/login',
            data        
    }

    try {
        const {data:{token,username}} = await Axios.request<LoginApiResponse>(requestConfig);
        storeToken(token,username)
        return{
            "token":token,
            "username":username
        }
    } 
    catch (e) {
        console.error(e)

        if (e.response){
            return {error:e.response.data}
        }

        else{
            return{error:"No response, probably network problems"} 
        }
    }
} 

export const onRegister = async(data : Credentials) => {
    const requestConfig : AxiosRequestConfig = {
        method:'post',
        url: process.env.REACT_APP_BACKEND_API + '/api/user/register',
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



const storeToken = (token:string,username:string) => {
    localStorage.setItem(KEY_TOKEN, token)
    localStorage.setItem("Username", username)
}