import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight, Alert, Image, TouchableOpacity, FlatList, ToastAndroid } from 'react-native';
import {auth, database} from '../config/firebase_config'
import {createStackNavigator} from 'react-navigation';
import { Dialog } from 'react-native-simple-dialogs';
import _database from '../action/Firebase_database';
import Image_ from '../components/Image_';
import { List, ListItem, Avatar, Badge} from "react-native-elements";
import Button_ from '../components/Button_';

var badge = 0;

export default class Receive_apply extends React.Component {

    constructor(props){
        console.log('BAR-- SortApply_Screen');

        super(props)
  
        this.state={
            refreshing: false,
            receiveApply:[],
            isVisible_dialog: false,
        }
        this._dialog;
    }

    componentDidMount(){
        _database.sort_receive()
        .then((data)=>{
            this.setState({receiveApply:data})
        })
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
      };

    onClickListener=async(viewID, item)=>{

    }

    _render_dialog= (item) =>{      //다이얼로그 출력
         /* 검색한 사용자 정보의 뷰를 클릭했을 경우*/
        let button;
        if(item.partner_userid){
            button=(<Text>이미 파트너가 있습니다.</Text>)
        }else{
            button=(
                <Button_ type='text' title='수락' style={{backgroundColor:'pink'}} onPress={()=>{
                    _database.addPartner(item.userid)
                    .then(()=>{
                        this.props.navigation.navigate('TIMELINE',{add_partner:true});
                    })
            }}/>
            )
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

    _item_onpress=(item)=>{
        if(item.CODE=='APPLY'){
            this.setState({isVisible_dialog:true},()=>{
                this._render_dialog(item);
            });
        }
    }

    _renderItem = ({item}) => {
        let comment='';

        if(item.CODE == 'APPLY'){
            comment=' 님이 친구요청을 하셨습니다.';
        }
        console.log('item.userid ' + item.userid);

        return(
        <ListItem
            key={item.userid}
            leftAvatar={<Avatar rounded large source={{uri: item.profile_picture}} height={60} width={60}/>}
            title={item.username + comment}
            chevron={true}
            onPress={()=>this._item_onpress(item)}
        />
      );
    }

    render(){

        console.log('render');
        return( 
            <View style={styles.container}>
               {this.state.isVisible_dialog?this._dialog:(<View></View>)}
                    <FlatList  
                        data={this.state.receiveApply}     //출력할 데이터
                        keyExtractor={(item, index) => item.userid}
                        extraData={this.state}      //변경 사항이 있을때 확인
                        ItemSeparatorComponent={this.renderSeparator}
                        containerStyle={{ borderBottomWidth: 0 }}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                        renderItem={this._renderItem}
                        />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 100
      },

    profile_picture:{
        width : 65,
        height: 65,
        borderRadius: 25,
        margin: 10
    },
    user_cotainer:{
        flex:3,
        flexDirection: 'row',
        alignItems: 'center'
    },
    pluss_button_container:{
        flex:1,
        alignItems:'center',
        justifyContent: 'center'
    },
    pluss_button:{
        width: 30,
        height:30
    }
  });