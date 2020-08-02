import React, { PropsWithChildren } from 'react'

import { Container, Typography } from '@material-ui/core'

export default function Error({ children }: PropsWithChildren<{}>) {
  return (
    <Container style={{ textAlign: 'center' }}>
      {
        children || <Typography variant="h5">Ah oh! Something went wrong.</Typography>
      }
    </Container>
  )
}
