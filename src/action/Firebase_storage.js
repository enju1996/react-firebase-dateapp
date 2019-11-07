import {storage} from '../config/firebase_config'
import _auth from './Firebase_auth'
let instance;

class Firebase_storage{
    constructor(){
        if(instance){
            return instance;
        }
        instance = this;
    }

    //스토리지에 프로필사진 등록
    _update_profile_picture=async(uid, profile_picture)=>{
        let imagesRef = storage.ref('image/' + uid + '/profile_image.png');
        let url

        //스토리지에 사진 등록
        const response = await fetch(profile_picture);
        const blob = await response.blob();
        await imagesRef.put(blob)
        .catch((err)=>{
            console.log(err.message)
        });

        //저장된 사진 url가져옴
        await imagesRef.getDownloadURL()
        .then((data)=>{
            url = data;
        })
        .catch((err)=>{
            console.log(err)
        })

        return url
    }

    _get_default_profile_picture=async()=>{
        let imagesRef = storage.ref('default/default_avata.png');
        let url;

        await imagesRef.getDownloadURL()
        .then((data)=>{
            url=data;
        })
        .catch((err)=>{
            console.log(err)
        })
        return url;
    }
}

export default _storage = new Firebase_storage();
