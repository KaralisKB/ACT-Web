import { Typography, Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { ColorModeContext, tokens } from "./../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import TextField from "@mui/material/TextField";
import { useLogout } from "./../hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation for detecting route changes
import api from "../services/apiClient";
import { rows } from "../Symbol";

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 10,
});

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { logout } = useLogout();
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Detect route changes

  // Retrieve user and selected client info from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const selectedClient = JSON.parse(localStorage.getItem("selectedClient")) || null;

  const clientId = typeof selectedClient === 'string' ? selectedClient : selectedClient?.id;

  useEffect(() => {
    let active = true;
    const loadBalance = async () => {
      if (!user?.id || !clientId) { setBalance(0); return; }
      try {
        const response = await api.get(`/api/client/balance/${user.id}/${clientId}`);
        if (active) setBalance(response.data.balance);
      } catch (error) {
        if (active) setBalance(null);
      }
    };
    loadBalance();
    window.addEventListener('act:balance-changed', loadBalance);
    return () => { active = false; window.removeEventListener('act:balance-changed', loadBalance); };
  }, [location.pathname, user?.id, clientId]);

  // Logout handler
  const logoutHandler = async () => {
    await logout();
    navigate("../");
  };

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} p={2}>
        {/* App Title */}
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: "5px 5px 5px 5px" }}
        >
          Stock Portfolio Manager
        </Typography>

        {/* Search Bar (Optional) */}
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px" sx={{ maxWidth: "100%", width: { xs: "100%", md: 350 } }}>
          <Autocomplete
            filterOptions={filterOptions}
            options={rows}
            getOptionLabel={(option) => `${option.description} (${option.symbol})`}
            onChange={(event, option) => { if (option) navigate('/details', { state: { symbol: option.symbol, name: option.description } }); }}
            sx={{ width: "100%", color: "black" }}
            renderInput={(params) => (
              <TextField {...params} label="Enter Name" placeholder="Add Company" />
            )}
          />
        </Box>

        {/* User Actions */}
        <Box display="flex" flexWrap="wrap">
          {/* Wallet Icon with Balance */}
          <IconButton
            sx={{ border: 1, borderRadius: 3 }}
            title="Virtual cash balance"
            aria-label="Virtual cash balance"
          >
            <AccountBalanceWalletOutlinedIcon sx={{ mr: "10px" }} />
            {balance === null ? "Balance unavailable" : `$${balance.toFixed(2)}`}
          </IconButton>

          {/* Dark Mode Toggle */}
          <IconButton aria-label="Toggle light and dark theme" onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>

          {/* Logout Button */}
          <IconButton aria-label="Log out" onClick={logoutHandler}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default Topbar;
