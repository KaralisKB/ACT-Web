import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { tokens } from '../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountBalanceSharpIcon from '@mui/icons-material/AccountBalanceSharp';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import CandlestickChartOutlinedIcon from '@mui/icons-material/CandlestickChartOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useAuthContext } from '../hooks/useAuthContext';

const items = [
  ['Dashboard', '/home', HomeOutlinedIcon], ['Clients', '/clients', AccountCircleIcon],
  ['Watchlist', '/watchlist', AccountBalanceSharpIcon], ['Portfolio', '/portfolio', ContactsOutlinedIcon],
  ['Orders', '/orders', ReceiptLongOutlinedIcon], ['News', '/news', NewspaperOutlinedIcon],
  ['IPO', '/ipo', CandlestickChartOutlinedIcon], ['Reviews', '/testimonials', RateReviewOutlinedIcon],
];

export default function HamburgerMenu() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const small = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthContext();
  const location = useLocation();
  const compact = small || collapsed;
  return <Sidebar collapsed={compact} collapsedWidth="64px" backgroundColor={colors.primary[400]} rootStyles={{ minHeight: '100vh', borderColor: colors.grey[700], flexShrink: 0 }}>
    <Menu>
      <MenuItem title={compact ? 'Menu' : 'Collapse menu'} component="button" icon={<MenuOutlinedIcon />} onClick={() => setCollapsed(!collapsed)}>
        <Typography variant="h4">Menu</Typography>
      </MenuItem>
      {!compact && <Box p={3} textAlign="center">
        <AccountCircleIcon sx={{ fontSize: 64, color: colors.greenAccent[400] }} />
        <Typography variant="h3">{user.firstName} {user.lastName}</Typography>
        <Typography color="text.secondary">Virtual Investor</Typography>
      </Box>}
      {items.map(([title, to, Icon]) => <MenuItem key={to} title={title} active={location.pathname === to} icon={<Icon />} component={<Link to={to} />} style={{ color: colors.grey[100] }}>
        <Typography>{title}</Typography>
      </MenuItem>)}
    </Menu>
  </Sidebar>;
}
