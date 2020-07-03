import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {FiUpload} from 'react-icons/fi'

import './style.css'

interface Props{
    onFileUploaded:(file:File)=>void
}

const Dropzone:React.FC<Props> = ({onFileUploaded}) => {
    const [selectedFileurl,setSelectedFileUrl] = useState('')


  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]

    const fileUrl = URL.createObjectURL(file)

    console.log(fileUrl)

    setSelectedFileUrl(fileUrl)
    onFileUploaded(file)

  }, [onFileUploaded])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
      accept:'image/*'
    })

  return (
    <div className='dropzone' {...getRootProps()}>
      <input {...getInputProps()} accept='image/*'/>
        {
            selectedFileurl?(
                <img src={selectedFileurl} alt='imagem do estabelecimeto'></img>
            )
                :(
                    isDragActive ?
                <p>Solte sua imagem aqui</p> :
            <p>
              <FiUpload />
              Imagem do estabelecimento...
              </p>
                )
        }
    </div>
  )
}

export default Dropzone