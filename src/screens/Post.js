import React from 'react';
import { ScrollView, Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import _auth from '../action/Firebase_auth'
import { Icon, Container, Content, Header, Left, Body, Right, Button } from 'native-base';
import dateFormat from 'dateformat';
import Image_ from '../components/Image_';
import SparkButton from 'react-native-sparkbutton';

class Post extends React.Component{

    constructor(props){
        super(props);   
        const { navigation } = this.props;
        this.state={
            picture:[],
            content:'',
            timestamp:'',
            like:false
        }
        console.log('POST');
      }

      loadData=()=>{
        return new Promise((resolve, rejects)=>{
            this.setState({
                picture:this.props.navigation.getParam('picture'),
                content:this.props.navigation.getParam('content'),
                timestamp:this.props.navigation.getParam('timestamp'),
                like:this.props.navigation.getParam('like')
            },()=>{
                resolve();
            });
        })
      }

      componentDidMount(){
        this.loadData().then(()=>{
            this.setState(this.state)
        })
      }

      renderImage=()=>{
          return this.state.picture.map((item, index) => 
            <Image key={index} source={{uri:item}} style={{width:'100%', height: 300, marginBottom: 10}}/>
       )
      }
      render(){
          console.log('scroll view render')
          return(
              <Container>
                  <Content>
                        <View style={{flex:1}}>
                            <View style={{weidth:'100%'}}>
                                <View style={{margin:15, flexDirection:'row'}}>
                                    <Image_ type='profile_small' source={{uri:_auth.user._profile_picture}} />
                                    <View style={{marginLeft:10, flexDirection:'column'}}>
                                        <Text style={{fontSize: 15}}>{_auth.user._username} 님이 글을 남기셨습니다.</Text>
                                        <Text style={{fontSize: 15}}>{dateFormat(this.state.timestamp, "yyyy년 mm 월 dd 일")}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{weidth:'100%'}}>
                                <Text style={{fontSize: 10}}>{this.state.content}</Text>
                            </View>

                            <View style={{flexDirection:'row', flex:1, marginTop:10, marginBottom:10, backgroundColor:'pink'}}>
                                <View style={{flex:1}}>
                                    <TouchableOpacity>
                                        <View style={{flexDirection:'row'}}>
                                            <SparkButton        
                                                ref={(comp) => this._spark = comp}
                                                style={{ width:'100%', height:'100%',resizeMode:'contain'}}
                                                activeImageSrc={require('../../resource/icon/heart.png')}    //활성 이미지의 소스
                                                inactiveImageTint={'rgba(255,255,255,0.8)'}   //활성 이미지에 적용 할 색조 색
                                                primaryColor={"yellow"}   //폭발의 주요 색상
                                                secondaryColor={"red"}    //폭발을위한 2 차 색상
                                                animationSpeed={1}        //폭발 속도
                                                checked={this.state.like}     //확인했는지 여부. 장착 후 체크 된 경우 애니메이션을 재생합니다.
                                                //onCheckedChange={(checked) => this.setState({ checked })} 
                                                onPress={()=>{this.setState({
                                                    like:!this.state.like
                                                })}}/>
                                                <Text>좋아요</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex:1}}>
                                    <TouchableOpacity>
                                        <Image source={require('../../resource/icon/comment.png')} style={{ width:50, height:50,resizeMode:'contain'}}/>
                                    </TouchableOpacity>
                                </View>
                             </View>
                        </View>
                        <View>
                            {/* 사진 출력 */}
                            {this.renderImage()}
                        </View>
                    </Content>
              </Container>
          )
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
// export default withNavigation(TimeLine);
export default (Post);