import React from 'react'
import { Typography } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import * as col from '@mui/material/colors';


function Testing() {
  return (
    <>
    <Typography
    ml={2}
    sx={{mx:6, color:col.pink[500], fontWeight:'bold', fontStyle}}
    variant="h5"
    component="h5"
    >h1. Heading</Typography>
    </>
  )
}

export default Testing