import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Alert, Image, TouchableOpacity, FlatList, ToastAndroid, Modal } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {auth, database} from '../config/firebase_config'
import { Dialog } from 'react-native-simple-dialogs';
import { List, ListItem, Avatar, Badge} from "react-native-elements";

import Strings from '../Strings';
import Button_ from '../components/Button_'
import TextInput_ from '../components/TextInput_'
import Loading_ from '../components/Loading_'

import _database from '../action/Firebase_database';
import Image_ from '../components/Image_';

export class Search_partner extends React.Component {

    constructor(props){
        super(props)
  
        this.state={
            text:'',
            FlatListItems: [],  //친구 신청이 가능한 사람
            isVisible_spinner: false,

            isVisible_dialog: false,
            onClick_badge_view: false
        }

        this._dialog=(<View></View>);

        this.recipient={
            userid :'',
            username:'',
            user_text:'',
            profile_picture:''
        }
        // console.log('처음 : ' + this.state.isVisible_dialog);
        
    }

    componentDidMount(){
    }

    //상단바
    static navigationOptions = ({navigation})=>{
      
    return{title:'파트너 검색',
            headerStyle: {
            backgroundColor: "white"
            },
            headerTintColor: "black",
            headerTitleStyle: {
            
            },
         
        }
    }

    renderSeparator = () => {  
        return (  
            <View  style={styles.separator}>
                
            </View>
            
        );  
    };  

    //리스트 클릭됨 
    getListViewItem = (item) => {  
        this.setState({isVisible_dialog:true}); 

        this.recipient.userid = item.userid;
        this.recipient.username = item.username;
        this.recipient.profile_picture = item.profile_picture;
        this.recipient.profile_text = item.profile_text;
    }  
    
    onClickListener=async(viewID)=>{
        if(viewID == 'ok'){
            this.setState({
                FlatListItems:[],
                isVisible_spinner:true
            });

            await _database._shearch_user(this.state.text)
            .then((users)=>{
                this.setState({
                    FlatListItems:JSON.parse(JSON.stringify(users)),
                    isVisible_spinner:false
                });
            })
        }
        this.setState(this.state)
    }

    _render_dialog= (item) =>{
        let button = (<View/>);
        // console.log('눌렸음 : ' + this.state.isVisible_dialog);

        if(item.op == 'send'){
            button=(<Text>이미 파트너 신청을 보냈습니다.</Text>);
        }else if(item.op == 'get'){
            button=(<Text>파트너 신청을 받았습니다.</Text>);
        }else{
            button = (
                <Button_ style={{backgroundColor:'pink'}} type='text' title='파트너 신청하기' onPress={async()=>{
                    this.onClickListener('app_partner')
                   await _database.sendApply(item.uid)
                   .then(async()=>{
                       this.setState({isVisible_dialog:false},()=>{
                           ToastAndroid.show('친구 신청이 완료되었습니다.', ToastAndroid.SHORT);
                       });

                       await _database._shearch_user(this.state.text)       //재검색
                       .then((users)=>{
                           this.setState({
                               FlatListItems:JSON.parse(JSON.stringify(users)),
                               isVisible_spinner:false
                           });
                       })
                   });
                   
                   }}/>
            );
        }

        this._dialog= (
            <View>
                <Dialog
                    visible={this.state.isVisible_dialog}
                    onTouchOutside={() => this.setState({isVisible_dialog: false})} 
                    >
                    <View style={{flexDirection:'column', alignItems:'center'}}>
                        <Image_ source={{uri:item.profile_picture}} type='profile_big'/>
                        <Text>{item.username}</Text>
                        <Text>{item.profile_text}</Text>
                        {button}
                    </View>
                </Dialog>
            </View>
        )

        this.setState(this.state)
    }

    _renderItem = ({item}) => (
        <ListItem
            key={item.uid}
            leftAvatar={<Avatar rounded large source={{uri: item.profile_picture}} height={60} width={60}/>}
            title={item.username}
            subtitle={item.profile_text}
            chevron={true}
            onPress={()=>{
                this.setState({isVisible_dialog:true},()=>
                this._render_dialog(item)
                )}
            }
            badge={{
                status:item.op=='send'
                ?'success'
                :item.op=='get'
                ?'primary'
                :null,
              }}
        />
      );
      
    _render_content=()=>{
        if(this.state.isVisible_spinner){   //검색중
            return(
                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <Loading_ 
                        color='pink'
                        isVisible={this.state.isVisible_spinner}
                        type='FadingCircleAlt'/>
                </View>
            )
        }else{
            return(
                <View style={{flex:1, justifyContent:'center'}}>
                    <FlatList  
                        data={this.state.FlatListItems}     //출력할 데이터
                        extraData={this.state}      //변경 사항이 있을때 확인
                        keyExtractor={(item, index) => item.uid}
                        renderItem={this._renderItem}/>
                </View>
            );
        }
    }

    render(){
        return( 
           
            <View style={styles.container}>

                <View style={styles.container__search}>
                    <Text> {Strings.SEARCH_PARTNER_NOTICE} </Text>
                    <TextInput_ 
                        placeholder='Email'                    // 안내문
                        keyboardType='email-address'           //TextInput => 이메일 키보드 타입
                        underlineColorAndroid='transparent'    //밑줄 색
                        onChangeText={(text)=>this.setState({text})}
                    />

                    <Button_ type='text' title='확인' style={{backgroundColor:'pink'}} onPress={()=>this.onClickListener('ok')}/>
                    {this.state.isVisible_dialog?this._dialog:(<View></View>)}
                </View>

                <View style={styles.container__list}>
                  {this._render_content()}
               </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    container__list: {
        flex: 1,
      },
      container__search:{
        alignItems: 'center',       //Flex Direction의 방향(세로방향)과 수직정렬
        backgroundColor: 'white',
        marginTop: 30,
        marginLeft:20,
        marginRight:20
      },

    inputs:{
        marginTop: 10,
        borderWidth: 1,

    },
    item_content:{
        flex:3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor:'pink'
    },
    okButton: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width:250,
        borderRadius:30,
        margin:10,
        backgroundColor: '#00b5ec',
    },
    separator:{
        height: 1,  
        width: "100%",
        backgroundColor: "black",  
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: 'black'
      }
  });

  export default createStackNavigator({
    SET_PARTNER: {
      screen: Search_partner
    }
 });