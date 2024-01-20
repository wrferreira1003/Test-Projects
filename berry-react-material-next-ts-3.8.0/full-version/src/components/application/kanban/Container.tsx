'use client';

import React, { useEffect, useState, SyntheticEvent } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Tab, Tabs } from '@mui/material';

// project imports
import Loader from 'ui-component/Loader';
import MainCard from 'ui-component/cards/MainCard';
import { getUserStory, getUserStoryOrder, getProfiles, getComments, getItems, getColumns, getColumnsOrder } from 'store/slices/kanban';

import { useDispatch } from 'store';
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| APPLICATION - KANBAN ||============================== //
interface Props {
  children: any;
}
function KanbanPage({ children }: Props) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const [loading, setLoading] = useState<boolean>(true);

  let selectedTab = 0;
  switch (pathname) {
    case '/apps/kanban/backlogs':
      selectedTab = 1;
      break;
    case '/apps/kanban/board':
    default:
      selectedTab = 0;
  }

  const [value, setValue] = useState(selectedTab);
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const items = dispatch(getItems());
    const columns = dispatch(getColumns());
    const columnOrder = dispatch(getColumnsOrder());
    const profile = dispatch(getProfiles());
    const comments = dispatch(getComments());
    const story = dispatch(getUserStory());
    const storyOrder = dispatch(getUserStoryOrder());

    Promise.all([items, columns, columnOrder, profile, comments, story, storyOrder]).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader />;

  return (
    <Box sx={{ display: 'flex' }}>
      <Grid container>
        <Grid item xs={12}>
          <MainCard contentSX={{ p: 2 }}>
            <Tabs
              value={value}
              variant="scrollable"
              onChange={handleChange}
              sx={{
                px: 1,
                pb: 2,
                '& a': {
                  minWidth: 10,
                  px: 1,
                  py: 1.5,
                  mr: 2.25,
                  color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                },
                '& a.Mui-selected': {
                  color: 'primary.main'
                },
                '& a > svg': {
                  marginBottom: '0px !important',
                  mr: 1.25
                }
              }}
            >
              <Tab
                sx={{ textTransform: 'none' }}
                component={Link}
                href="/apps/kanban/board"
                label={value === 0 ? 'Board' : 'View as Board'}
                {...a11yProps(0)}
              />
              <Tab
                sx={{ textTransform: 'none' }}
                component={Link}
                href="/apps/kanban/backlogs"
                label={value === 1 ? 'Backlogs' : 'View as Backlog'}
                {...a11yProps(1)}
              />
            </Tabs>
            {children}
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default KanbanPage;
