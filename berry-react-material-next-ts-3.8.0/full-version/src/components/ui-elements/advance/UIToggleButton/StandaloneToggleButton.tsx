'use client';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, ToggleButton } from '@mui/material';

// assets
import CheckIcon from '@mui/icons-material/CheckTwoTone';

// ============================|| UI TOGGLE BUTTON - STANDALONE ||============================ //

export default function StandaloneToggleButton() {
  const theme = useTheme();
  const [selected, setSelected] = React.useState(false);

  return (
    <Grid container justifyContent="center">
      <ToggleButton
        value="check"
        aria-label="standalone button"
        onChange={() => {
          setSelected(!selected);
        }}
        sx={{ color: theme.palette.success.dark, bgcolor: theme.palette.success.light }}
      >
        <CheckIcon />
      </ToggleButton>
    </Grid>
  );
}
