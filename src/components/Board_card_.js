import React from 'react';
import {StyleSheet, TouchableOpacity, Text, Image, View, ScrollView} from 'react-native'
import _auth from '../action/Firebase_auth'
import { Icon, Button,ListItem, Row } from 'native-base';
import dateFormat from 'dateformat';

import Image_ from '../components/Image_';
import Card_ from '../components/Card_';
import SparkButton from 'react-native-sparkbutton';

import database_ from '../action/Firebase_database'
import APPLICATION_TEXT from '../Strings';

export default class Board_card_ extends React.Component{
    constructor(props){
        super(props);

        this.picture;
        this.board;
    }

    _getProfileView=(key)=>{      //timeline의 프로필 뷰 세팅
        return(
          <ListItem itemDivider key={key}  style={[styles.flatlist_item,{marginBottom: 2}]}>
            <View style={styles.profile_container}>
              <View style={styles.profile__picture}>
                
                <Image_ type='profile_medium' source={{uri:_auth.user._profile_picture}} />
              </View>
  
              <View style={{flex:2, flexDirection: 'column', margin: 5}}>
                    <Text style={{fontSize: 30}}>{_auth.user._username}</Text>
                    <Text style={{fontSize: 20}}>{_auth.user._profile_text}</Text>
              </View>
  
              <View style={{flex: 2, flexDirection: 'column', margin: 5}}>
                <Button bordered dark
                        style={{flex:1, justifyContent:'center', height:30, marginTop:10}}>
                  <Text>Edit Profile</Text>
                </Button>
                <Button bordered dark small icon
                        style={{flex:1,   justifyContent:'center', height:30, marginTop:10}}>
                  <Icon name="settings" />
                </Button>
            </View>
              </View>
        </ListItem>
        );
      }
  
  
      _getHeaderview=(key)=>{       //timeline의 해더 세팅

         if(_auth.user.partner_userid){
            const date1 = new Date(_auth.start_timestamp);
            const date2 =  new Date();
            const diffTime = Math.abs(date2.getTime() - date1.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            return (
              <ListItem itemDivider key={key}  style={[styles.flatlist_item,{marginBottom: 2}]}>
                <View style={styles.content_header}>
                  <View style={{margin:5}}>
                    <Image_ type='profile_small' source={{uri:_auth.user.profile_picture}}/>
                  </View>
                  <View style={{margin:5}}>
                    <Text>{_auth.partner.username}님을 {diffDays}일 째 모시는 중</Text>
                  </View>
                  <View style={{margin:5}}>
                    <Image_ type='profile_small' source={{uri:_auth.partner.profile_picture}}/>
                  </View>
                </View>
              </ListItem>
           );
        }else{
          return (
            <ListItem itemDivider key={key}  style={[styles.flatlist_item,{marginBottom: 2}]}>
              <View style={styles.content_header}>
                <Text>빛이 나는 솔-로</Text>
              </View>
            </ListItem>
         );
        }

      }
  
  
      _getIntroView=(key)=>{
        let cards = APPLICATION_TEXT.TIMELINE__CARD;
  
        return (
          <ListItem itemDivider key={key}  style={[styles.flatlist_item,{marginBottom: 2}]}>
             <View style={styles.intro}>
                <View style={styles.intro__content}>
                  <Text style={{fontSize: 30}}>{APPLICATION_TEXT.TIMELINE__INTRO__CONTENT.TITLE}</Text>
                  <Text>{APPLICATION_TEXT.TIMELINE__INTRO__CONTENT.CONTENT_1}</Text>
                  <Text>{APPLICATION_TEXT.TIMELINE__INTRO__CONTENT.CONTENT_2}</Text>
               </View> 
  
              <View style={{marginLeft:20, marginTop:20}}>
                <Text>
                  프로필을 작성하고 파트너를 찾아보세요
                </Text>
              </View> 
                  <ScrollView horizontal ={true}>
                    <Card_ code={cards[0].CODE} onPress={this.props.onPress_UPDATE_PROFILE}/>
                    <Card_ code={cards[1].CODE} onPress={this.props.onPress_SEARCH_PARTNER}/>
                    <Card_ code={cards[2].CODE} onPress={this.props.onPress_RECIEVE_APPLY}/>
                  </ScrollView>
              </View>
          </ListItem>
       );
      }

    _render_picture=(key, picture)=>{
      if((key != 'profileView') && (key != 'header')){
        if(picture.length == 0){
          this.board = ((
            <View>

             </View>
          ));
        }else if(picture.length == 1){
          this.board = ((
            <View  style={styles.image_container}>
                <TouchableOpacity style={{flex:1}} onPress={this.props.onPress_POST}>
                  <Image_ type='big' source={{uri:picture[0]}}/>
                </TouchableOpacity>
            </View>
          ));
        } else if(picture.length == 2){
          this.board = ((
            <View  style={styles.image_container}>
              <TouchableOpacity style={{flex:1}} onPress={this.props.onPress_POST}>
                  <Image_ type='medium' source={{uri:picture[0]}}/>
                  <Image_ type='medium' source={{uri:picture[1]}}/>
              </TouchableOpacity>
            </View>
          ));
        }else if(picture.length == 3){
          this.board = ((
            <View  style={styles.image_floor_container}>
             <TouchableOpacity style={{flex:1}} onPress={this.props.onPress_POST}>
                <View style={styles.image_container}>
                  <Image_ type='medium' source={{uri:picture[0]}}/>
                </View>
                <View style={styles.image_container}>
                  <Image_ type='small' source={{uri:picture[1]}}/>
                  <Image_ type='small' source={{uri:picture[2]}}/>
                </View> 
              </TouchableOpacity>
            </View>
          ));
        }
        else if(picture.length==4){
          this.board = ((
            <View  style={styles.image_floor_container}>
              <TouchableOpacity style={{flex:1}} onPress={this.props.onPress_POST}>
                  <View style={styles.image_container}>
                    <Image_ type='medium' source={{uri:picture[0]}}/>
                    <Image_ type='medium' source={{uri:picture[1]}}/>
                  </View>
                  <View style={styles.image_container}>
                    <Image_ type='medium' source={{uri:picture[2]}}/>
                    <Image_ type='medium' source={{uri:picture[3]}}/>
                  </View> 
                </TouchableOpacity>
              </View>
          ));
        }else{
          this.board = ((
            <View  style={styles.image_floor_container}>
               <TouchableOpacity style={{flex:1}} onPress={this.props.onPress_POST}>
                  <View style={styles.image_container} >
                    <Image_ type='medium' source={{uri:picture[0]}}/>
                  </View>
                  <View style={styles.image_container}>
                    <Image_ type='small' source={{uri:picture[1]}}/>
                    <Image_ type='small' source={{uri:picture[2]}}/>
                    <Image_  type='small' source={{uri:picture[3]}}/>
                  </View> 
                  </TouchableOpacity>
                </View>
          ));
        }
      }
    }
    _renderItem = (key) => {    //게시글 하나씩 그림
      const picture=(this.props.picture)?[...this.props.picture]:null;
      const content=this.props.content;
      const timestamp=this.props.timestamp;
      const like = this.props.like;

      if(picture){
        this._render_picture(key, picture);
      }

         let formattedTime=dateFormat(timestamp, "yyyy년 mm 월 dd 일");
          return(
            <ListItem itemDivider key={key} style={styles.flatlist_item}>
                {this.board}
              <View style={styles.board__date}>
                <Text>
                    {formattedTime}
                </Text> 
              </View>

                <View style={styles.board__react}>
                <View style={styles.board__react__icon}>
                  <TouchableOpacity>
                    <SparkButton        
                      ref={(comp) => this._spark = comp}
                      style={{ width:'100%', height:'100%',resizeMode:'contain'}}
                      activeImageSrc={require('../../resource/icon/heart.png')}    //활성 이미지의 소스
                      inactiveImageTint={'rgba(255,255,255,0.8)'}   //활성 이미지에 적용 할 색조 색
                      primaryColor={"yellow"}   //폭발의 주요 색상
                      secondaryColor={"red"}    //폭발을위한 2 차 색상
                      animationSpeed={1}        //폭발 속도
                      checked={like}     //확인했는지 여부. 장착 후 체크 된 경우 애니메이션을 재생합니다.
                      //onCheckedChange={(checked) => this.setState({ checked })} 
                      onPress={this.props.onPress_like}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.board__react__icon}>
                  <TouchableOpacity>
                    <Image source={require('../../resource/icon/comment.png')} style={{ width:'100%', height:'100%',resizeMode:'contain'}}/>
                  </TouchableOpacity>
                </View>
            </View>

            <View style={styles.board__text}>
                <Text>
                {content}
              </Text> 
            </View>

            </ListItem>
     
            );
      }

      handleSpark = () => {
        this._spark.playAnimation();
      }

    render(){
        let view =(<View />);
        const key=this.props.type;
        switch(key){
            case 'profileView':
                view = this._getProfileView(key);
            break;

            case 'header':
                view = this._getHeaderview(key);
            break;

            case 'intro':
                view = this._getIntroView(key);
            break;
            
            default:
                view = this._renderItem(key);
            break;
        }
        
        return view;
    }
}


const styles = StyleSheet.create({
    profile_container:{
      flexDirection:'row',
      padding:5,
    },
    profile__picture:{
      flex:1, 
      alignItems:'center', 
      margin: 10
    },
    content_header:{
      flexDirection: 'row',
      alignItems:'center',
      justifyContent:'center',
      height: 50,
    },
    image_container:{
      flex: 1,
      width: '100%',
      flexDirection: 'row',
    },
    image_floor_container:{
      flex: 1,
      width: '100%',
      flexDirection: 'column',
    },
    flatlist_item:{
      flexDirection: 'column',
      paddingTop:0,
      paddingBottom: 3,
      paddingLeft:0,
      paddingRight:0,
      marginTop: 0,
      marginBottom:10,
      marginLeft:0,
      marginRight:0,
      backgroundColor: 'white',
      },
    intro:{
      width:'100%',
      height: 600,
      flexDirection: 'column',
      marginLeft:0,
      paddingBottom:0,
      paddingTop:0,
      paddingRight:0,
      paddingLeft:0
    },
    intro__content:{
      flexDirection: 'column',
      width:'100%',
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft:0,
      marginBottom:2
    },
    board__text:{
      width:'100%',
      marginRight:5,
      marginLeft:5,
      marginBottom:7
    },
    board__react:{
      width:'100%',
      flexDirection:'row',
      marginLeft:5
    },
    board__react__icon:{
      width:40,
      height:40,
      marginRight:5,
    },
    board__date:{
      width:'100%',
      alignItems:'flex-end'
    }

});