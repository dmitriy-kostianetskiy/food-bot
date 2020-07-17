import React from 'react';

import { Container, Typography } from '@material-ui/core';

export default function Error() {
  return (
    <Container style={{ textAlign: 'center' }}>
      <Typography variant="h5">Ah oh! Something went wrong.</Typography>
    </Container>
  );
}
