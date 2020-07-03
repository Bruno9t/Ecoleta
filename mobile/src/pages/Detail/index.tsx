import React,{useState,useEffect} from 'react'
import {Feather as Icon,FontAwesome} from '@expo/vector-icons'
import {View,StyleSheet,Text, TouchableOpacity,Image,SafeAreaView,Linking} from 'react-native'
import {useNavigation,useRoute} from '@react-navigation/native'
import Constants from 'expo-constants'
import api from '../../services/api'
import * as MailComposer from 'expo-mail-composer';

import {RectButton} from 'react-native-gesture-handler'

interface Params{
  point_id: number;
}

interface Data{
  point:{
    image:string,
    image_url:string,
    name:string,
    email:string,
    whatsapp:string,
    city:string,
    uf:string,
  },
  items:{
    title:string
  }[]
}

const Detail = ()=>{
    const [data, setData] = useState<Data>({} as Data)

    const navigation = useNavigation()
    const route = useRoute()

    const routeParams = route.params as Params

    
  useEffect(()=>{
    api.get(`points/${routeParams.point_id}`).then(response=>{
      return setData(response.data)
    })
  },[])


    function handleNavigateBack(){
        return navigation.goBack()
    }

    function handleComposeMail(){
      MailComposer.composeAsync({
        subject:'Interesse na coleta de resíduos',
        recipients:[data.point.email],
      })
    }

    function handleWhatsapp(){
      Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`)
    }

    if(!data.point){
      return null;
    }

    return (
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <TouchableOpacity onPress={handleNavigateBack}>
                <Icon name='arrow-left' size={22} color="#34cb79" /> 
        </TouchableOpacity>

        <Image style={styles.pointImage} source={{uri:data.point.image_url}} />

    <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item=>item.title).join(', ')}
        </Text>

        <View style={styles.address}>
            <Text style={styles.addressTitle}>
                Endereço
            </Text>
            <Text style={styles.addressContent}>
                {data.point.city}, {data.point.uf}
            </Text>

        </View>

        </View>

        <View style={styles.footer}>
            <RectButton style={styles.button} onPress={handleWhatsapp}>
                <FontAwesome name='whatsapp' size={20} color='#FFF'/>
                <Text style={styles.buttonText}>Whatsapp</Text>
            </RectButton >
            <RectButton style={styles.button} onPress={handleComposeMail}>
                <Icon name='mail' size={20} color='#FFF'/>
                <Text style={styles.buttonText}>E-mail</Text>
            </RectButton >         
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    pointImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 28,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    pointItems: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    address: {
      marginTop: 32,
    },
    
    addressTitle: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    },
  
    addressContent: {
      fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Roboto_500Medium',
    },
  });

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       paddingHorizontal: 32,
//       paddingTop: 20 + Constants.statusBarHeight,
//     },
  
//     title: {
//       fontSize: 20,
//       fontFamily: 'Ubuntu_700Bold',
//       marginTop: 24,
//     },
  
//     description: {
//       color: '#6C6C80',
//       fontSize: 16,
//       marginTop: 4,
//       fontFamily: 'Roboto_400Regular',
//     },
  
//     mapContainer: {
//       flex: 1,
//       width: '100%',
//       borderRadius: 10,
//       overflow: 'hidden',
//       marginTop: 16,
//     },
  
//     map: {
//       width: '100%',
//       height: '100%',
//     },
  
//     mapMarker: {
//       width: 90,
//       height: 80, 
//     },
  
//     mapMarkerContainer: {
//       width: 90,
//       height: 70,
//       backgroundColor: '#34CB79',
//       flexDirection: 'column',
//       borderRadius: 8,
//       overflow: 'hidden',
//       alignItems: 'center'
//     },
  
//     mapMarkerImage: {
//       width: 90,
//       height: 45,
//       resizeMode: 'cover',
//     },
  
//     mapMarkerTitle: {
//       flex: 1,
//       fontFamily: 'Roboto_400Regular',
//       color: '#FFF',
//       fontSize: 13,
//       lineHeight: 23,
//     },
  
//     itemsContainer: {
//       flexDirection: 'row',
//       marginTop: 16,
//       marginBottom: 32,
//     },
  
//     item: {
//       backgroundColor: '#fff',
//       borderWidth: 2,
//       borderColor: '#eee',
//       height: 120,
//       width: 120,
//       borderRadius: 8,
//       paddingHorizontal: 16,
//       paddingTop: 20,
//       paddingBottom: 16,
//       marginRight: 8,
//       alignItems: 'center',
//       justifyContent: 'space-between',
  
//       textAlign: 'center',
//     },
  
//     selectedItem: {
//       borderColor: '#34CB79',
//       borderWidth: 2,
//     },
  
//     itemTitle: {
//       fontFamily: 'Roboto_400Regular',
//       textAlign: 'center',
//       fontSize: 13,
//     },
//   });

export default Detail
