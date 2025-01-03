import { Typography, Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { ColorModeContext, tokens } from "./../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { useLogout } from "./../hooks/useLogout";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation for detecting route changes
import axios from "axios";
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
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const location = useLocation(); // Detect route changes

  // Retrieve user and selected client info from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const selectedClient = JSON.parse(localStorage.getItem("selectedClient")) || null;

  // Debugging: Log user and selectedClient to ensure they exist
  useEffect(() => {
    console.log("User from localStorage:", user);
    console.log("Selected Client from localStorage:", selectedClient);
  }, [user, selectedClient]);

  // Fetch client balance from the API
  const fetchClientBalance = async () => {
    const clientId = typeof selectedClient === "string" ? selectedClient : selectedClient?.id;

    console.log("Fetching balance for user:", user, "and client:", clientId);
    if (user?.id && clientId) {
      try {
        const response = await axios.get(
          `https://act-production-5e24.up.railway.app/api/client/balance/${user.id}/${clientId}`
        );
        console.log("Balance API Response:", response.data);
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching client balance:", error.message);
      }
    } else {
      console.warn("User or clientId is missing, skipping balance fetch.");
      setBalance(0);
    }
  };

  // Fetch balance on page load, route changes, and whenever user or selected client changes
  useEffect(() => {
    fetchClientBalance();
  }, [location, user?.id, selectedClient]);

  // Logout handler
  const logoutHandler = async () => {
    await logout();
    navigate("../");
  };

  // Redirect to payment page when wallet icon is clicked
  const handleWalletClick = () => {
    const stripePaymentLink = "https://buy.stripe.com/test_28o02c2cPglb5O0289";
    window.open(stripePaymentLink, "_blank");
  };

  return (
    <div display="fixed">
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
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
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
          <Autocomplete
            filterOptions={filterOptions}
            options={rows}
            getOptionLabel={(option) => option.description}
            style={{ width: 500, color: "black" }}
            renderInput={(params) => (
              <TextField {...params} label="Enter Name" placeholder="Add Company" />
            )}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* User Actions */}
        <Box display="flex">
          {/* Wallet Icon with Balance */}
          <IconButton
            sx={{ border: 1, borderRadius: 3 }}
            onClick={handleWalletClick}
          >
            <AccountBalanceWalletOutlinedIcon sx={{ mr: "10px" }} />
            ${balance ? balance.toFixed(2) : "0.00"}
          </IconButton>

          {/* Dark Mode Toggle */}
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>

          {/* Notifications Icon (Optional) */}
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>

          {/* Settings Icon (Optional) */}
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>

          {/* Logout Button */}
          <IconButton onClick={logoutHandler}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
};

export default Topbar;
