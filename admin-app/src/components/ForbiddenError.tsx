import React from 'react'

import { Typography } from '@material-ui/core'
import Error from './Error'

export default function ForbiddenError() {
  return (
    <Error>
      <Typography variant="h5">Oops! You are not permitted to see requested resource.</Typography>
    </Error>
  )
}
