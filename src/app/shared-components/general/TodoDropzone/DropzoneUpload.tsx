import { Box, Card, CardContent, Typography } from "@mui/material";

import React, { useState } from 'react';
import { styled, useTheme } from "@mui/material/styles";
import { useDropzone } from 'react-dropzone';
import { showMessage } from "app/store/fuse/messageSlice";
import { useAppDispatch } from "app/store";


const DropBox = styled(Box)<any>(({ isDragActive }) => ({
  height: '250px',
  borderWidth: '1px',
  borderColor: '#9A9A9A',
  borderStyle: 'dashed',
  display: 'flex',
  borderRadius: '1rem',
  transition: '0.5 all ease-in-out',
  cursor: 'pointer',
  backgroundColor: isDragActive ? '#43B2AE' : '#F1F0F0',
  color: isDragActive ? '#FFF' : '#8E8D8D',
}));

const DropzoneUpload = ({setUploadedFiles}) => {
  const dispatch = useAppDispatch();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log('acceptedFiles ', acceptedFiles)
      if(acceptedFiles.length > 0){
        setUploadedFiles(acceptedFiles);
      }
    },
    onDropRejected: (response) => {
      console.log('Errors ', response)
      if(response[0]?.errors[0]?.code === 'file-too-large'){
        triggerMessage('El archivo excede el límite de tamaño.');
      }else if(response[0]?.errors[0]?.code === 'file-invalid-type'){
        triggerMessage('Este formato de archivos no está soportado.');
      }else{
        triggerMessage('Ocurrió un error. Por favor, intenta de nuevo más tarde.');
      }
    },
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] 
    },
    maxSize: 150000000,
    maxFiles: 1
  });

  const triggerMessage = (message, variant='error') => {
		dispatch(
			showMessage({
				message,
				autoHideDuration: 10000, // ms
				anchorOrigin: {
					vertical: 'top', // top bottom
					horizontal: 'center' // left center right
				},
				variant: variant // success error info warning null
			})
		);
	};

  return (
    <DropBox {...getRootProps()} isDragActive={isDragActive}>
      <input {...getInputProps()} />
          <Typography
              sx={{
                textAlign: 'center',
                fontSize: "1.6rem",
                margin: "auto",
              }}
            >
              Haz clic en el área o arrastra el archivo.
            </Typography>
    </DropBox>
  );
};
export default DropzoneUpload;