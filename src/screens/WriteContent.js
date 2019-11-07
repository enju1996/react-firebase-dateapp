
import React from 'react';
import { Dimensions, StyleSheet, Text, View, Button, ScrollView,Image, TextInput, TouchableOpacity, Alert, ToastAndroid} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {database, storage} from '../config/firebase_config';
import { Container, Left, Right, Header, Content} from 'native-base';
import _auth from '../action/Firebase_auth'
import _database from '../action/Firebase_database'
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import APPLICATION_TEXT from '../Strings';
import {PermissionsAndroid} from 'react-native';

const { width } = Dimensions.get('window')

export default class writeContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Load:'init',
      position:[],
      addressText: APPLICATION_TEXT.WRITE__LOCATION_TEXT,
      location:[],
      storageURL: [],  //스토리지에서 꺼내온 url
      photos:[],
      content:'',
      isOpenImagePicker:false
    }
    

    this.screenWidth=width;
    this.screenHeight=Dimensions.get('window').height;
    
    for(let i = 0; i < 5; i++){
      let b = {key: i, data: '경기도 어딘가로 오세요'}
      this.state.location.push(b);
    }
  }

    componentDidMount(){
      this.props.navigation.setParams({ onClickListener: this.onClickListener });
    }
   

    onClickListener=async(viewID)=>{
      if(viewID=='catchLocation'){
        if (PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)) {   //퍼미션 확인

          Geolocation.getCurrentPosition(
              (position) => {
                  this.setState({
                    position : [position.coords.latitude, position.coords.longitude],
                    addressText: position.coords.latitude + ' ' + position.coords.longitude
                  })
              },
              (error) => {
                  // See error code charts below.
                  console.log(error.code, error.message);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
          }
        } else if(viewID == 'upload'){
          _database._uploadBoard(this.state.photos, this.state.content)
          .then(()=>{
            ToastAndroid.show('게시중...', ToastAndroid.SHORT);
            this.setState({
              storageURL: [],  //스토리지에서 꺼내온 url
              photos:[],
              content:'',
            })
            this.props.navigation.navigate('TIMELINE');
          }).catch(function(err){
            console.log(err);
          });

        }else if(viewID == 'insert_image'){
          console.log('갤러리 열기 isOpenImagePicker : ' + this.state.isOpenImagePicker)
            if(!this.state.isOpenImagePicker){    //갤러리가 열려있지 않은 경우 염

              this.setState({
                isOpenImagePicker: true   //갤러리가 열려있음
              },()=>{
                 ImagePicker.openPicker({
                  multiple: true,
                  maxFiles: 4
                }).then(images => {
                  console.log('이미지 선택 완료');
                  this.setState({
                    photos: images.map(elem=>elem.path),
                    isOpenImagePicker: false  //갤러리가 닫음
                  },()=>{
                    console.log('선택 완료 isOpenImagePicker : ' + this.state.isOpenImagePicker)
                  })
                });
              })
            }
        }
        
      }

  renderImage(item, i) {
    return(
      <Image
        style={styles.selected_Image}
        source={{uri: item}}
        key={i}
      />
    )
  }

  renderLocation(item, i) {
    return(
      <TouchableOpacity
        style={styles.location_data}
        key={i}>
        <Text>{item.data}</Text>
        
      </TouchableOpacity>
    )
  }


   render() {

    return (
      <Container style={styles.container}>
        <Header style={{backgroundColor: 'white'}}>
            <Left>
            <TouchableOpacity onPress={() => Alert.alert('Right Menu Clicked')}>
              <Text
                style={{
                  color: 'black',
                }}>
                뒤로
              </Text>
            </TouchableOpacity>
            </Left>
            <Right>
            <TouchableOpacity onPress={() => this.onClickListener('upload')}>
              <Text
                style={{
                  color: 'black',
                }}>
                게시
              </Text>
            </TouchableOpacity>
            </Right>
        </Header>
           
        <Content contentContainerStyle={{ flex: 1 }}  scrollEnabled={false}>
          <View style={{flex: 1.5, flexDirection: 'row', borderColor:'DCDCDC',borderBottomWidth:1}}>
                <ScrollView style={{flex:1}} horizontal={true}>
                  {this.state.photos.map((item,i) => this.renderImage(item,i))}

                  <View style={[styles.selected_Image, styles.insert_button]}>
                    <TouchableOpacity style={{flex:1}}onPress={()=>this.onClickListener('insert_image')}>
                        <Text>+</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
          </View>

            <View style={{flex: 1, borderColor:'DCDCDC',borderBottomWidth:1}}>
              <TouchableOpacity style = {styles.Touchable} onPress={()=>this.onClickListener('catchLocation')}>
                <Text>{this.state.addressText}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, flexDirection: 'row',alginItems: 'stretch', borderColor:'DCDCDC',borderBottomWidth:1}}>
            <ScrollView
                horizontal={true}>

                {this.state.location.map((item,i) => this.renderLocation(item,i))}
              </ScrollView>
            </View>

            <View style={{flex: 6, alginItems: 'stretch'}}>
                <TextInput style = {{flex: 1}}
                  onChangeText={(content)=>{
                    this.setState({content: content})
                    console.log(this.state.content);
                  }}
                  editable = {true}
                  maxLength = {40}
              />
            </View>
          </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#fff',
  },
  selected_Image:{
    flex:1,
    width: width/4,
    margin: 5
  },
  Touchable:{
    flex:1,
    flexDirection:'column',
    justifyContent: 'center',
    margin: 5
    },
  location_data:{
    justifyContent: 'center',
    margin: 10,
    padding: 2,
    borderRadius: 5,
    borderColor:'gray', 
    borderWidth: 2

  },
  insert_button: {
    backgroundColor:'white',
    borderStyle:'dashed',
    borderRadius : 1,
    borderColor:'gray', 
    borderWidth: 2
  }
});
