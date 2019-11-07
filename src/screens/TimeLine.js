import React from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Alert, TouchableHighlight, FlatList, Image, Platform, RefreshControl } from 'react-native';
import { Icon, Container, Content, Header, Left, Body, Right, Button } from 'native-base';
import {database, auth, storage} from '../config/firebase_config';
import {PermissionsAndroid} from 'react-native';

import _database from '../action/Firebase_database'
import _auth from '../action/Firebase_auth'

import Board_card_ from '../components/Board_card_';

const showBoardnum = 5;   //화면에 보여질 게시글 개수

class TimeLine extends React.Component{

    constructor(props){
        super(props);   

        this.spinner;

        this.state={
          boardItems : [{key: 'profileView', like: false}, {key: 'header', like: false}],    //모든 게시글
          width : Dimensions.get('window').width,
          refreshing: false,
        }

      }

      static get showBoardnum() {     //한번에 로드할 게시글 수
        return showBoardnum;
      }

      static navigationOptions = ({navigation})=>{    //상단바

        return{
          title: "dateApp",
          headerStyle: {
            backgroundColor: "white"
          },
          headerTintColor: "black",
          headerTitleStyle: {
            
          },
  
            headerLeft: (
              <TouchableOpacity onPress={() => Alert.alert('Right Menu Clicked')}>
                <Text
                  style={{
                    color: 'black',
                  }}>
                  Left Menu
                </Text>
              </TouchableOpacity>
            ),
            headerRight: (
              <TouchableOpacity  onPress={navigation.getParam('__goSortScreen')}>
                  <Image
                      source={require('../../resource/badge.png')}
                  />
              </TouchableOpacity>
              )
            }
        }

    requestPermission=async()=>{
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Cool Photo App Camera Permission',
              message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
          } else {
            console.log('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
    }

    componentDidMount =async()=>{
      const { navigation } = this.props;
      this.focusListener = navigation.addListener("didFocus", () => {
        // console.log('화면 변경됨')
      });

      this.props.navigation.setParams({ __goSortScreen: this._goSortScreen }); 
      _database._getUserData(auth.currentUser.uid)   //사용자 데이터 로드
      .then(async()=>{
         this._draw_boards()
      })    //게시글 로드 및 홈 뷰 구성
      this.requestPermission();
    }

    render(){        
        ('render');
        return(

          <Container style={{backgroundColor: '#DCDCDC'}}>
             <Content contentContainerStyle={{ flex: 1 }}>
 
                <View style={{flex: 7}}>
                <View  style={{flex: 1, width: this.state.width}}>

                    <FlatList  
                      data={this.state.boardItems}     //출력할 데이터
                      keyExtractor={(item, index) => item.key}
                      containerStyle={{ borderBottomWidth: 0 }}
                      renderItem={this._renderItem}             //아이템 하나씩 그리기
                       stickyHeaderIndices={[1]}
                       extraData={this.state}
                    />

                  </View>
                </View>
                </Content>
            </Container>
        )
    }


    _goSortScreen=()=>{
        this.props.navigation.navigate('SORT_APPLY');
    }

    onClickListener=(veiwID)=>{
      if(veiwID == 'go_setPartner'){
        this.props.navigation.navigate('SET_PARTNER');
      }

    }

      _renderItem = ({item, index}) => {    //게시글 하나씩 그림
        return (
        
        <Board_card_       
          type={item.key}
          like={item.like}
          content={item.content}
          timestamp={item.timestamp}
          picture={item.picture?[...item.picture]:null}
          onPress_like={()=>{     //하트가 클릭될 경우 애니메이션 실행
            this.setState({boardItems: this.state.boardItems.map(
                      elem=>{
                        if(elem.key === item.key){
                          let container = {};
                          container = JSON.parse(JSON.stringify(elem));
                          container.like = !elem.like
                          return container;
                        }
                        return elem;
                      }
                      )},()=>{
                        this.setState(this.state);
                    })
          }}
          onPress_POST={()=>this.props.navigation.navigate('POST',{picture:[...item.picture],
                                                                    content:item.content,
                                                                    timestamp:item.timestamp,
                                                                    like:item.like
                                                                  })}   //이미지 클릭 시 실행  
                                                                            
          onPress_UPDATE_PROFILE={()=>this.props.navigation.navigate('UPDATE_PROFILE')}
          onPress_SEARCH_PARTNER={()=>this.props.navigation.navigate('SEARCH_PARTNER')}
          onPress_RECIEVE_APPLY={()=>this.props.navigation.navigate('RECIEVE_APPLY')}
        />);
      }


    _update_data=async(snapshot)=>{   //보드에 있는 내용을 가져옴
      return new Promise((resolve)=>{
        let arr =[];
        // console.log('데이터 가져옴')
        snapshot.forEach((childSnapshot)=> {

          let b={
            key:childSnapshot.key,
            content: childSnapshot.val().content,
            picture:[],
            timestamp:childSnapshot.val().timestamp,
            like: childSnapshot.val().like
          };
  
          if(childSnapshot.val().picture){
            b.picture = Object.values(childSnapshot.val().picture);
          }
          arr.push(b);
        });
        arr.reverse();
        this.setState({
          boardItems:this.state.boardItems.concat(arr),
          refreshing:false
          },()=>{
          resolve();
        })
      })
    }
  
  _draw_boards=async()=>{
      let boardRef =  database.ref('boards/' + _auth.user.Board_Key + '/post');
      // console.log('보드키 : ' + _auth.user.Board_Key)
      if(_auth.user.Board_Key!='false'){    //파트너가 있을 경우
          // console.log('파트너 있음/수집 이력 없음')
            boardRef.orderByChild('timestamp').on('value',(snapshot)=>{
              this.setState({
                boardItems:[{key: 'profileView', content: '', like: false}, {key: 'header', content:'', like: false}],
                refreshing: true
                },()=>{
                this._update_data(snapshot)
              })     
             
           })
      }else{    //파트너가 없을 경우
        // console.log('파트너 없음')
        this.setState({
          boardItems:[{key: 'profileView', content: '', like: false}, {key: 'header', content:'', like: false}, {key:'intro', text: '', like:false}]
        });
      }
  }

  onRegionChange(region) {
    this.setState({ region });
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
      },
    contentContainer:{
        flex: 3,
        backgroundColor: 'green'
    }

});

// export default withNavigation(TimeLine);
export default (TimeLine);