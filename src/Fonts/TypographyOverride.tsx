import { Global } from '@emotion/react';
import { Typography } from '@mui/material';

const TypographyOverride = () => (
  <Global
    styles={{
      '@font-face': {
        fontFamily: 'Apercu Pro',
        src: 'url(apercu_regular_pro.otf) format("truetype")',
      },
      '.MuiTypography-root': {
        fontFamily: 'Apercu Pro, sans-serif',
      },
    }}
  />
);

export default TypographyOverride;
