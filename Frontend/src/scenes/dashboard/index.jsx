import * as React from "react";
import { Box, useTheme } from "@mui/system";
import { IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Header from "../../components/Header";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import api from "../../services/apiClient";
import { tokens } from "../../theme";

import { rows } from "../../finalStockData";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Define columns
  const columns = [
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 140,
      cellClassName: "name-column--cell",
    },
    {
      field: "symbol",
      headerName: "Symbol",
      flex: 1,
      minWidth: 140,
      cellClassName: "symbol-column--cell",
    },
    {
      field: "figi",
      headerName: "FIGI",
      flex: 1,
      minWidth: 140,
      cellClassName: "symbol-column--cell",
    },
    {
      field: "mic",
      headerName: "MIC",
      flex: 1,
      minWidth: 140,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "Details",
      headerAlign: "center",
      headerName: "Add to Watchlist",
      flex: 1,
      minWidth: 140,
      align: "center",
      sortable: false,
      renderCell: (params) => {
        const OnAdd = async (e) => {
          e.stopPropagation(); // Prevent row selection when clicking button
      
          const stockTicker = params.row.symbol;

          // Retrieve and validate the user and client IDs from localStorage
          const user = JSON.parse(localStorage.getItem("user"));
          const selectedClient = JSON.parse(localStorage.getItem("selectedClient"));
      
          const userId = user?.id;
          const clientId = typeof selectedClient === "string" ? selectedClient : selectedClient?.id;
      
          if (!userId || !clientId) {
              console.error("User ID or Client ID is missing or undefined.");
              alert("User ID or Client ID is missing. Please log in again.");
              return;
          }
      
          try {
              await api.post('/api/watchlist/add', {
                  userId,
                  clientId,
                  stockTicker,
              });
      
              // Optionally show confirmation
              alert(`Added ${stockTicker} to the watchlist.`);
          } catch (error) {
              alert(error.response?.data?.error || "The stock could not be added. Please try again.");
          }
      };
      
      

        return <IconButton aria-label={`Add ${params.row.symbol} to watchlist`} onClick={OnAdd}><AddCircleOutlineIcon /></IconButton>;
      },
    },
  ];

  return (
    <>
      <Header
        title="Stock Listings With Symbols"
        subtitle="Welcome to home page"
      />

      <Box m="20px">
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          {rows && (
            <DataGrid
              rows={rows}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;

