// menu import
import samplePage from './sample-page';
import pages from './pages';
import other from './other';

// types
import { NavItemType } from 'types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [samplePage, pages, other]
};

export default menuItems;
