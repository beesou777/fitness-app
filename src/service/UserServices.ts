import { get, set, remove } from "../helper/storage";
import $axios from "../helper/axios";
import { config } from "@/utils/baseUrl";



interface UserDetailDataModel {
    activity: number;
    birthday: string;
    created_at: string;
    gender: number;
    goal: number;
    height: number;
    id: number;
    language: string;
    settings: string;
    updated_at: string;
    user_id: number;
    weight: number;
}

interface UserDataModel {
    calories: number;
    carbohydrate: number;
    created_at: string;
    details: UserDetailDataModel;
    email: string;
    email_verified_at: null
    fat: number;
    fcmtoken: string;
    id: number;
    name: string;
    protein: number;
    updated_at: string;
}

interface UpdateUserDataModel {
    gender: number;
    dob: string;
    weight: number;
    height: number;
    activity: number;
    goal: number;
    language: string;
}

interface UpdateSettingModel {
    key: string;
    value: string;
}

interface WaterConsumptionModel {
    ml: number;
}

interface TrackWeightModel {
    weight: number;
}

export async function isSetup() {
    const set_up = await get("is_setup")
    if (set_up == 'true') {
        return true;
    } else {
        return false;
    }
}

export async function updateUserData(detail: UpdateUserDataModel) {
    const data = await $axios.post(config.API_BASE_URL + 'user',detail)
        .then(resp => {
            if (resp.data.user.calories > 0) {
                const is_setup = 'true';
                set("is_setup", is_setup)
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            return false;
        })

        return data;
}

export async function getUserData() {
    const data = await $axios(config.API_BASE_URL + 'user')
        .then(resp => {
            if (resp.data.calories != null) {
                return resp.data as UserDataModel;
            }
            return null;
        })
        .catch(err => {
            console.log(err);
            return null;
        })

        return data;
}

export async function updateUserSetting(setting: UpdateSettingModel) {
    const data = await $axios.post(config.API_BASE_URL + 'updateSettings',setting)
        .then(resp => {
            if (resp.data.status) {
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            return false;
        })

        return data;
}

export async function trackWeight(weight: TrackWeightModel) {
    const data = await $axios.post(config.API_BASE_URL + 'trackWeight',weight)
        .then(response => {
            if (response.data.weight) {
                return true;
            } 
            
            return false;
        })
        .catch(err => {
            console.log(err);
            return false;
        })

        return data;
}

export async function trackWaterConsumption(ml: WaterConsumptionModel) {
    const data = await $axios.post(config.API_BASE_URL + 'trackWaterConsumption',ml)
        .then(response => {
            if (response.data.waterConsumption) {
                return true;
            } 
            
            return false;
        })
        .catch(err => {
            console.log(err);
            return false;
        })

        return data;
}

export async function deleteAccount() {
    const data = await $axios.delete(config.API_BASE_URL + 'deleteAccount')
        .then(resp => {
            if (resp.data.status) {
                remove("access_token")
                remove("is_setup")
                delete $axios.defaults.headers.common['Authorization']
                return true;
            } else {
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            return false;
        })

        return data;
}