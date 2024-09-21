import {Preferences} from '@capacitor/preferences';

export async function set(key:string, value:any) {
    await Preferences.set({
        key: key,
        value: JSON.stringify(value)
    })
}

export async function get(key:string) {
    const item = await Preferences.get({key: key})
    if(item && item.value !== null){
        return JSON.parse(item.value)
    }
    return null
}
export async function remove(key:string) {
    await Preferences.remove({key: key})
    
}