import React from 'react';
import { Alert, ToastAndroid} from 'react-native';

import {database, auth, storage} from '../config/firebase_config'
import _storage from '../action/Firebase_storage';
import _auth from '../action/Firebase_auth'

import dateFormat from 'dateformat';

let instance;

class Firebase_database extends React.Component{
    constructor(props){
        super(props)
       
       if(instance){
           Alert.alert('인스턴스 있음');
           return instance;
       };

       this._storageURL=[]

        this.boardItems = [];
        instance = this;
    }



    sendApply=async(uid)=>{    //파트너 신청
      return new Promise((resolve, reject)=>{
        database.ref('applys').push({
            send: auth.currentUser.uid,
            get: uid
        }).then(()=>{ resolve(); })
        .catch(()=>{ reject(); });
      
        })
  }

     //검색한 이메일 및 이름과 일치하는 사용자 정렬
     _shearch_user=async(str)=>{
      let rootRef = database.ref();
      let uid = auth.currentUser.uid;
      let users = [];
      let result = [];
      let applys =[];
      //모든 사용자 정보 가져옴
      await rootRef.child('users').once('value')
      .then((snapshot)=>{
          snapshot.forEach((childData)=>{
              let user = childData.val();
              user.uid = childData.key;
              users.push(user);
          })
      });

    
      //사용자의 친구 신청 밎 수신 정보
      await rootRef.child('applys').once('value')   //보낸사람(send)가 현재 로그인한 유저(uid)인 경우
      .then((snapshot)=>{
          snapshot.forEach((childData)=>{
              let item = childData.val();
              item.uid = childData.key;
              if(item.get == uid || item.send == uid){     //내가 이사람에게 이미 친구신청 받음
                  applys.push(item)
              }
          })
      });

  
      users.forEach((item, index, object)=>{
          if(item.email.includes(str) || (item.username.includes(str))){      //이메일이나 이름을 포함하는 경우
              if((!item.partner_userid) && !(item.uid==uid)){     //현재 파트너가 없고 자기 자신이 아닌 경우
                console.log('파트너 없음 / 자기자신 아님 ' + item.profile_text)
                let isApply = false; 
                applys.map((element)=>{
                      let user=item;
                      if(element.get==user.uid){       //내가 이미 검색된 사람에게 신청을 보낸경우
                          user.op='send'
                          isApply=true;
                          result.push(JSON.parse(JSON.stringify(user)));
                      }else if(element.send == user.uid){       //검색된 사람에게 신청을 받은 경우
                          user.op='get'
                          isApply=true;
                          result.push(JSON.parse(JSON.stringify(user)));
                        }
                      
                  })
                  if(!isApply){
                    item.op='false';
                    result.push(JSON.parse(JSON.stringify(item)));
                 }
            }
          }
      })

      result.map((element)=>{
        console.log(element.profile_text + ' ' + element.op)
      })
      return Promise.resolve(result);
  }

    _getUserData=async(uid)=>{
      return new Promise(async(resolve)=>{
        console.log('uid : ' + uid);
        let partner_uid;
        await database.ref('/users/' + uid ).on('value',async(snapshot)=>{
          _auth.user.Board_Key = snapshot.val().Board_Key;
          _auth.user.email = snapshot.val().email;
          _auth.user.partner_userid = snapshot.val().partner_userid;
          _auth.user.profile_picture = snapshot.val().profile_picture;
          _auth.user.profile_text = snapshot.val().profile_text;
          _auth.user.username = snapshot.val().username;
          partner_uid= _auth.user.partner_userid;
        
          if(partner_uid){
            console.log('파트너 데이터 가져옴')
            await this._get_board_info();

            await database.ref('/users/' + partner_uid ).on('value',function(snapshot){
              _auth.partner.Board_Key = snapshot.val().Board_Key;
              _auth.partner.email = snapshot.val().email;
              _auth.partner.partner_userid = snapshot.val().partner_userid;
              _auth.partner.profile_picture = snapshot.val().profile_picture;
              _auth.partner.profile_text = snapshot.val().profile_text;
              _auth.partner.username = snapshot.val().username;
             
            })
          }
          resolve();
        })
        
      })
    }

    //회원에 대한 정보를 등룍
    _init_user_data = async(name, profile_picture=false, profile_text, uid = false) =>{   //소셜로그인일 경우에만 uid를 지정하여 호출, 이미지가 없을 경우 picture을 false로
      return new Promise(async(resolve)=>{
        try{
          let email = auth.currentUser.email;
          let userid;
          let url;

          if(uid != false){   //uid가 지정된 경우
            userid = uid;
          }else{
            userid = auth.currentUser.uid;
          }

          if(name != ''){      //유저 정보 데이터베이스에 삽입
  
            if(profile_picture){
               url = await _storage._update_profile_picture(userid, profile_picture)       //이미지 업로드 및 프로필 사진 url 구함
            }else{  //이미지가 없을 경우 디폴트 이미지로 설정
              url = await _storage._get_default_profile_picture();
            }

              //유저 정보를 디비에 저장
              await database.ref('users/' + userid).set({
                  username: name,
                  email: email,
                  profile_picture : url,
                  profile_text: profile_text,
                  partner_userid: '',
                  Board_Key: 'false'
                })
                .catch((err)=>{
                  console.log(err.message)
              });
          
              resolve();
          }else{  //이름 비어있음
              ToastAndroid.show('이름이 비어있습니다.', ToastAndroid.SHORT)
          }
        }catch(err){
          console.log(err)
        }
      })
  }

    //가입한 유저인지 확인(소셜 로그인 시에만 실행)
    _check_user=async(uid)=>{
      let isUser;
      await database.ref('users').orderByKey().equalTo(uid).once('value',(snapshot)=>{
        isUser = snapshot.numChildren();
      })

      return isUser==1?true:false;
    }
   
    _update_profile=async(uri)=>{
      let uid = auth.currentUser.uid;
      let updates = {};
      
      if(uri){   //이미지가 변경되었을 경우
        let url = await _storage._update_profile_picture(uid, uri);       //이미지 업로드 및 프로필 사진 url 구함
        _auth.user._profile_picture = url;    //현재 유저의 프로필 사진 정보를 변경
        updates['/users/' + uid + '/profile_picture'] =  _auth.user._profile_picture;   //디비 내용 변경
      }

      updates['/users/' + uid + '/Board_Key'] = _auth.user._Board_Key;
      updates['/users/' + uid + '/email'] =  _auth.user._email;
      updates['/users/' + uid + '/partner_userid'] = _auth.user._partner_userid;
      updates['/users/' + uid + '/profile_text'] =  _auth.user._profile_text;
      updates['/users/' + uid + '/username'] =  _auth.user._username;
      

      return database.ref().update(updates);
    }
  
    //신청받은 친구 목록
    sort_receive=async()=>{     

      let rootRef = database.ref();
      let receive_userid = [];
      let result = [];
      let uid = auth.currentUser.uid;

      //나에게 친구신청한 사람의 uid 가져옴
      await rootRef.child('applys').orderByChild('get').equalTo(uid).once('value')
      .then((snapshot)=>{
          snapshot.forEach(function(childData){
              var uid = childData.val().send;
              receive_userid.push(uid);
          })
          console.log('신청받음 : ' + receive_userid)
      });

      //친구신청한 사람의 정보 가져옴
      await rootRef.child('users/').once('value')
      .then((snapshot)=>{      
            snapshot.forEach(element => {     //모든 유저 정보
                receive_userid.forEach(uid =>{       //나에게 친구신청한 친구의 uid
                    if(element.key == uid){

                      let b = {};
                      b.Board_Key = element.val().Board_Key;
                      b.email = element.val().email;
                      b.userid = element.key;
                      b.profile_picture = element.val().profile_picture;
                      b.profile_text = element.val().profile_text;
                      b.username = element.val().username;
                      b.CODE = 'APPLY';
                      result.push(JSON.parse(JSON.stringify((b))));
                    }
                })
              }
              );

      });
      return Promise.resolve(JSON.parse(JSON.stringify(result)))
  }

    //파트너 맺어짐
    addPartner=async(partner_uid)=>{
      let rootRef = database.ref();
      let uid = auth.currentUser.uid;
      let timestamp=new Date()+'';
      let formattedTime=dateFormat(timestamp, "yyyy년 mm 월 dd 일");
      let key = this._getRendomKey();

       //현재 계정에 추가
      await rootRef.child('users').child(uid).update({     
          partner_userid: partner_uid,
          Board_Key: key
      })

      //신청한 계정에 추가
      await rootRef.child('users').child(partner_uid).update({      
          partner_userid:uid,
          Board_Key: key
      })

      //보드 데이터베이스에 시작일 저장
      await rootRef.child('boards').child(key).child('info').set({   //데이터베이스에 입력
          start_timestamp : timestamp,
        }
      )

      ToastAndroid.show('수락되었습니다.', ToastAndroid.SHORT);    

      
      await this._uploadBoard([], formattedTime + ' 부터 연애중')

      return Promise.resolve();
  }

    //랜덤키 생성
    _getRendomKey=()=>{

      let item_name           = '';
      let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charactersLength = characters.length;

      for ( var i = 0; i < 10; i++ ) {
        item_name += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      
      return item_name;
    }

    makeBlobArray=async(photos)=>{
      let blobArr = [];   //사진의 blob 배열
      console.log('photos' +photos );
      //저장할 사진의 blob array 생성
        for(const file of photos){ 
        //스토리지에 사진 등록
        const response =  await fetch(file);
        const blob =  await response.blob();
        await blobArr.push(blob);
      }
      console.log('blobArr' +blobArr );
      return blobArr
    }


  _putStorageItem(item, contentKey) {    //스토리지에 사진 업로드

    item_name = this._getRendomKey();
    // the return value will be a Promise
    return storage.ref('boards'+'/'+_auth.user._Board_Key+'/'+contentKey+'/'+item_name + '.jpg').put(item)
    .then(async(snapshot) => {
      
      let url = await snapshot.ref.getDownloadURL(); 
      this._storageURL.push(url);  //url 가져옴

      console.log('One success:', item)
    }).catch((error) => {
      console.log('One failed:', item, error.message)
    });
  }

  //데이터베이스와 스토리지에 게시글 업로드
  _uploadBoard=async(photos, content)=>{
    return new Promise(async(resolve, reject)=>{
      try{
      let contentKey = this._getRendomKey();
      let picture = {};
      let blobArr = await this.makeBlobArray(photos);

      //이미지 업로드에 대한 프로미스
      Promise.all(    //업로드에 대한 프로미스가 모두 완료될 때 까지 기다림
        // Array of "Promises"
        blobArr.map(item => this._putStorageItem(item, contentKey))    //스토리지에 사진 업로드
      )
      .then(async(url) => {

        for(let file of this._storageURL){     //스토리지에 등록된 url을 랜덤키와 함께 picture array에 저장
          picture[this._getRendomKey()] = file;
        }

        //데이터베이스에 사진 정보 입력
        await database.ref('boards').child(_auth.user._Board_Key).child('post').push(   //데이터베이스에 입력
          {
            timestamp : new Date()+'',
            content: content,
            picture : picture,
            like:false
          }
        )
        this._storageURL=[];

        ToastAndroid.show('게시가 완료되었습니다.', ToastAndroid.SHORT);
        console.log(`All success`)
      })
      .catch((error) => {
        console.log(`Some failed: `, error.message)
      });
      resolve();
    }catch(err){
      console.log(err);
    }
    })
  }

  _get_board_info=async()=>{
    let boardInfoRef =  database.ref('boards/' + _auth.user.Board_Key + '/info')
    let date;

    await boardInfoRef.once('value')
    .then((snapshot)=>{
      date=snapshot.val().start_timestamp;
      _auth.start_timestamp=date;
      console.log('가져옴 ' + date)
    })
  }
  }

export default _database = new Firebase_database();