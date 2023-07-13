import api from "./api";
import {store} from "../redux/store";

export const refreshToken = async(refresh) =>{
    try {
        await api.post("/UralIntern/token/refresh/",{
            refresh: refresh
        })
    }catch (e) {
        console.log(e);
    }
}
