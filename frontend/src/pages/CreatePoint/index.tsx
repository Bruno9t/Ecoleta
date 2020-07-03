import React,{useEffect, useState,ChangeEvent, FormEvent} from 'react'
import {Link,useHistory} from 'react-router-dom'

import Dropzone from '../../components/Dropzone'

import logo from '../../assets/logo.svg'
import {FiArrowLeft} from 'react-icons/fi'
import {Map,TileLayer, Marker} from 'react-leaflet'
import {LeafletMouseEvent} from 'leaflet'
import api from '../../services/api'
import axios from 'axios'

import './style.css'


interface Item{
    id:number,
    title:string,
    image_url:string,
}

interface TypedResponse<T = any> extends Response {
    // /**
    //  * this will override `json` method from `Body` that is extended by `Response`
    //  * interface Body {
    //  *     json(): Promise<any>;
    //  * }
    //  */
    json<P = T>(): Promise<P>
  }

interface IBGEUFResponse {
    sigla:string,
}

interface IBGECityResponse{
    id:number,
    nome:string
}

//<Item[]> ou <Array<Item>>

const CreatePoint = ()=>{
    const [items,setItems] = useState<Item[]>([])
    const [ufs,setUFs] = useState<string[]>([])
    const [cities, setCities] = useState<IBGECityResponse[]>([])
    const [selectedUF,setSelectedUF] = useState<string>('0')
    const [selectedCity,setSelectedCity] = useState<string>('0')
    const [selectedPosition,setSelectedPosition] = useState<[number,number]>([0,0])
    const [initialPosition,setInitialPosition] = useState<[number,number]>([0,0])
    const [selectedItems,setSelectedItems] = useState<number[]>([])

    const [selectedFile,setSelectedFile] = useState<File>()

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        whatsapp:''
    })

    // useEffect(()=>{
    //     navigator.geolocation.getCurrentPosition(position=>{
    //         const {latitude,longitude} = position.coords

    //         return setInitialPosition([latitude,longitude])
    //     })
    // },[])

    const history = useHistory()


    useEffect(()=>{
        api.get('items').then(response=>{
            setItems(response.data)
        })
    },[])

    useEffect(()=>{
        function getDataFromIBGE<T>(url:string): Promise<TypedResponse<T>> {
            return fetch(url)
        }

        getDataFromIBGE<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(res=> res.json())
        .then(ufs => {
            const ufInitials = ufs.map(uf => uf.sigla)

            return setUFs(ufInitials)
        })
    },[])

    useEffect(()=>{
        if(selectedUF === '0'){
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
        .then(response=>{

            const citiesName = response.data.map(city=> {
                return {
                    id:city.id,
                    nome:city.nome
                }
            })

            return setCities(citiesName)
        })

    },[selectedUF])

    function handleSelectUF(event:ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value

        return setSelectedUF(uf)
    }

    function handleSelectCity(event:ChangeEvent<HTMLSelectElement>){
        const city = event.target.value

        return setSelectedCity(city)
    }

    function handleMapClick(event:LeafletMouseEvent){
        const {lat , lng} = event.latlng

        setSelectedPosition([lat,lng])
    }

    function handleInputChange(event:ChangeEvent<HTMLInputElement>){

        const {name, value} = event.target

        return setFormData({...formData, [name]:value})

    }

    function handleSelectItem(id:number){

        const alreadySelected = selectedItems.findIndex(item=> item===id)

        if(alreadySelected>=0){
            const filteredItems = selectedItems.filter(item=>item!=id)

            return setSelectedItems(filteredItems)
        }else{
            return setSelectedItems([...selectedItems,id])
        }
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault()

        const {name,email,whatsapp} = formData
        const uf = selectedUF
        const city = selectedCity
        const [latitude,longitude] = selectedPosition
        const items = selectedItems

        const data = new FormData()

        
            data.append('name',name);
            data.append('email',email);
            data.append('whatsapp',whatsapp);
            data.append('uf',uf);
            data.append('city',city);
            data.append('latitude',String(latitude));
            data.append('longitude',String(longitude));
            data.append('items',items.join(','));        

        if(selectedFile){
            data.append('image',selectedFile)        
        }

        await api.post('points',data)

        alert('Ponto de coleta criado!')

        history.push('/')
    }



    return (
        <div id='page-create-point'>

            <header>
                <img src={logo} alt="Ecoleta" />

                <Link to='/'>
                    <FiArrowLeft />
                    Voltar para Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name='name'
                            id='name'

                            onChange={handleInputChange}
                        />

                        <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name='email'
                                id='email'

                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name='whatsapp'
                                id='whatsapp'

                                onChange={handleInputChange}
                            />

                        </div>
                    </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>

                    <Map center = {[-23.7469696,-46.7795968]} zoom={15} onClick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        /> 

                        <Marker position={selectedPosition}  />
                    </Map>  

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select onChange={handleSelectUF} value={selectedUF} name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf=>(
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city" >Cidade</label>
                            <select name="city" value={selectedCity} id="city" onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city=>(
                                    <option key={city.id} value={city.id}>{city.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>



                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                            key={item.id} 
                            onClick={()=>handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id)? 'selected':''}
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type='submit'>
                    Cadastrar ponto de coleta
                </button>
            </form>

        </div>
    )
}


export default CreatePoint