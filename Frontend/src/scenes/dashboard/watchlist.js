import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import Header from "../../components/Headers";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/apiClient";
import { CircularProgress } from "@mui/material";

const Watchlist = () => {
  const storedData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedData?.id; // Retrieve the user ID from localStorage

  const [error, setError] = useState('');
  const [rows, setRows] = useState([]); // Watchlisted stocks
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false); // State to handle dialog
  const [ticker, setTicker] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [alertPrice, setAlertPrice] = useState("");

  const [openAlertsDialog, setOpenAlertsDialog] = useState(false); // State to handle alerts dialog
  const [alerts, setAlerts] = useState([]); // Store price alerts
  const [loading, setLoading] = useState(false); // New state for loading

  const [openAIRecDialog, setOpenAIRecDialog] = useState(false);
  const [aiRecResponse, setAIRecResponse] = useState("");
  const [loadingAIRec, setLoadingAIRec] = useState(false); // Loading state for AI response
  const [aiRecStock, setAIRecStock] = useState(""); // To keep track of which stock is being queried
  const [reasoning, setReasoning] = useState("");



  const history = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleDialogOpen = async (stockTicker) => {
    try {
      const stockUrl = `https://finnhub.io/api/v1/quote?symbol=${stockTicker}&token=ce80b8aad3i4pjr4v2ggce80b8aad3i4pjr4v2h0`;
      const response = await api.get(stockUrl);
      setTicker(stockTicker);
      if (!Number.isFinite(response.data.c) || response.data.c <= 0) throw new Error("Quote unavailable");
      setCurrentPrice(response.data.c);
      setOpenDialog(true);
    } catch (error) {
      setError("A current market quote is unavailable. Try again later.");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setTicker("");
    setCurrentPrice("");
    setAlertPrice("");
  };

  const handlePriceAlertSubmit = async () => {
    if (!ticker || !alertPrice) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user")) || null;
      const selectedClient = JSON.parse(localStorage.getItem("selectedClient")) || null;

      const userId = user?.id;
      const clientId = selectedClient?.id || selectedClient;

      if (!userId || !clientId) {
        setError("Please select a client or log in again.");
        return;
      }

      await api.post("/api/alerts/add", {
        userId,
        stockSymbol: ticker,
        targetPrice: parseFloat(alertPrice),
        condition: parseFloat(alertPrice) > parseFloat(currentPrice) ? "above" : "below",
      });

      alert("Price alert added successfully.");
      handleDialogClose();
    } catch (error) {
      setError(error.response?.data?.error || "The price alert could not be saved.");
    }
  };

  const handleAIRecDialogOpen = async (stockTicker) => {
    setOpenAIRecDialog(true);
    setAIRecResponse(""); // Clear any previous response
    setReasoning(""); // Clear previous reasoning
    setLoadingAIRec(true); // Show loading symbol
    setAIRecStock(stockTicker); // Set the stock being queried
  
    try {
      if (!process.env.REACT_APP_AI_API_URL) {
        setAIRecResponse('Service unavailable');
        setReasoning('The previous AI service is offline. A replacement analysis service must be connected before recommendations can resume.');
        return;
      }
      const response = await api.post(process.env.REACT_APP_AI_API_URL, { stock_ticker: stockTicker });
      const fetchedRecommendation = response.data?.recommendation || 'No recommendation available.';
      const fetchedReasoning = response.data?.reasoning || 'No reasoning available.';
      setAIRecResponse(fetchedRecommendation);
      setReasoning(fetchedReasoning);
    } catch (error) {
      console.error("Error fetching AI recommendation:", error.response?.data || error.message);
      setAIRecResponse("Failed to fetch AI recommendation.");
      setReasoning("No reasoning available.");
    } finally {
      setLoadingAIRec(false); // Stop loading
    }
  };
  
  

  
  
  const handleAIRecDialogClose = () => {
    setOpenAIRecDialog(false);
    setAIRecResponse("");
    setAIRecStock("");
  };
  

  // Fetch watchlisted stocks for the current user
  const fetchWatchlist = async () => {
    // Retrieve user ID and client ID from localStorage
    const user = JSON.parse(localStorage.getItem("user")) || null;
    const selectedClient = JSON.parse(localStorage.getItem("selectedClient")) || null;

    const userId = user?.id; // Ensure the userId is valid
    const clientId = selectedClient?.id || selectedClient; // Ensure the clientId is valid

    if (!userId || !clientId) {
        console.error("User ID or Client ID is missing or undefined.");
        setError("Please select a client or log in again.");
        setIsLoading(false);
        return;
    }

    try {
        const response = await api.get(
            `/api/watchlist/${userId}/${clientId}`
        );
        console.log("Fetched watchlist:", response.data);

        const transformedData = await Promise.all(
            response.data.map(async (stock, index) => {
                try {
                    const stockUrl = `https://finnhub.io/api/v1/quote?symbol=${stock.ticker}&token=ce80b8aad3i4pjr4v2ggce80b8aad3i4pjr4v2h0`;
                    const stockResponse = await api.get(stockUrl);
                    const stockData = stockResponse.data;

                    return {
                        id: index, // Unique ID for DataGrid
                        name: stock.ticker, // Placeholder for company name (adjust if needed)
                        symbol: stock.ticker, // Symbol of the stock
                        today: stockData.c > 0 ? stockData.c : "N/A", // Current price
                        Percent: Number.isFinite(stockData.dp) ? `${stockData.dp}%` : "N/A", // Percent change
                        open: stockData.o || "N/A", // Open price
                        high: stockData.h || "N/A", // High price
                        low: stockData.l || "N/A", // Low price
                        close: stockData.pc || "N/A", // Previous close price
                        delete: stock.ticker, // For delete functionality
                        ids: stock.ticker, // Maintain unique reference for operations
                    };
                } catch (stockError) {
                    console.error(`Error fetching stock data for ${stock.ticker}:`, stockError);
                    return {
                        id: index,
                        name: stock.ticker,
                        symbol: stock.ticker,
                        today: "N/A",
                        Percent: "N/A",
                        open: "N/A",
                        high: "N/A",
                        low: "N/A",
                        close: "N/A",
                        delete: stock.ticker,
                        ids: stock.ticker,
                    };
                }
            })
        );

        setRows(transformedData); // Update the DataGrid rows with transformed data
    } catch (error) {
        setError(error.response?.data?.error || "Your watchlist could not be loaded.");
    } finally {
        setIsLoading(false);
    }
};


  // Delete a stock from the user's watchlist
  const deleteWatchlistItem = async (stockTicker) => {
    // Retrieve user and selected client from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;
    const selectedClient = JSON.parse(localStorage.getItem("selectedClient")) || null;

    const userId = storedUser?.id; // Extract userId
    const clientId = typeof selectedClient === "string" ? selectedClient : selectedClient?.id; // Ensure clientId is valid

    // Validation check for required IDs
    if (!userId || !clientId) {
        console.error("User ID or Client ID is missing or undefined.");
        setError("Please select a client or log in again.");
        return;
    }

    try {
        // Make the API call to delete the stock
        await api.delete("/api/watchlist/remove", {
            data: { userId, clientId, stockTicker }, // Include userId and clientId in the request
        });

        console.log(`Removed ${stockTicker} from client's watchlist.`);

        // Update the rows state
        setRows((prevRows) => prevRows.filter((row) => row.symbol !== stockTicker)); // Update rows to remove the deleted stock
    } catch (error) {
        setError(error.response?.data?.error || "The stock could not be removed.");
    }
};

const fetchPriceAlerts = async () => {
  setLoading(true); // Start loading
  try {
      const response = await api.get(
          `/api/alerts/${userId}`
      );
      console.log("Fetched alerts from backend:", response.data.alerts); // Debugging response
      setAlerts(response.data.alerts); // Ensure this sets the alerts array properly
      setOpenAlertsDialog(true); // Open dialog only after alerts are fetched
  } catch (error) {
      setError(error.response?.data?.error || "The alerts could not be loaded.");
  } finally {
      setLoading(false); // Stop loading
  }
};


const deletePriceAlert = async (alertId) => {
  try {
    await api.delete(`/api/alerts/remove`, {
      data: { userId, alertId }, // Sending `userId` and `alertId` in the request body
    });
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
  } catch (error) {
    setError(error.response?.data?.error || "The alert could not be removed.");
  }
};



  const handleAlertsDialogClose = () => {
    setOpenAlertsDialog(false);
    setAlerts([]);
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const columns = [
    { field: "name", headerName: "Company Name", flex: 1, minWidth: 160 },
    { field: "symbol", headerName: "Symbol", flex: 0.5 },
    { field: "today", headerName: "Current Price", flex: 0.5, minWidth: 125, type: "number" },
    { field: "Percent", headerName: "Percent Change", flex: 0.5, minWidth: 125, type: "number" },
    { field: "open", headerName: "Open", flex: 0.3, type: "number" },
    { field: "high", headerName: "High", flex: 0.3, type: "number" },
    { field: "low", headerName: "Low", flex: 0.3, type: "number" },
    { field: "close", headerName: "Close", flex: 0.3, type: "number" },
    {
      field: "AI Rec",
      headerName: "AI Recommendation",
      minWidth: 165,
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => handleAIRecDialogOpen(params.row.symbol)}
          variant="contained"
          color="secondary"
        >
          AI Rec
        </Button>
      ),
    },    
    {
      field: "Add Alert",
      headerName: "Price Alert",
      minWidth: 135,
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => handleDialogOpen(params.row.symbol)}
          variant="contained"
          color="info"
        >
          Add Alert
        </Button>
      ),
    },
    {
      field: "Buy",
      headerName: "Buy",
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => history("/buyStock", { state: params.row })}
          variant="contained"
          color="success"
        >
          Buy
        </Button>
      ),
    },
    {
      field: "Sell",
      headerName: "Sell",
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => history("/sellStock", { state: params.row })}
          variant="outlined"
          color="error"
        >
          Sell
        </Button>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      sortable: false,
      renderCell: (params) => (
        <DeleteIcon
          onClick={() => deleteWatchlistItem(params.row.symbol)}
          style={{ cursor: "pointer", color: "red" }}
        />
      ),
    },
    {
      field: "Details",
      headerName: "Details",
      sortable: false,
      renderCell: (params) => (
        <AddCircleOutlineIcon
          onClick={() => history("/details", { state: params.row })}
          style={{ cursor: "pointer" }}
        />
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Watchlist" subtitle="Your Watchlisted Stocks" />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Typography color="text.secondary" sx={{ mb: 2 }}>Price alerts are saved targets; background notifications are not active.</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchPriceAlerts}
        style={{ marginBottom: "20px" }}
      >
        View Price Alerts
      </Button>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          loading={isLoading}
        />
      </Box>

      {/* Dialog for Adding Price Alert */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Price Alert</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Stock Ticker"
            type="text"
            fullWidth
            value={ticker}
            disabled
          />
          <TextField
            margin="dense"
            label="Current Price"
            type="number"
            fullWidth
            value={currentPrice}
            disabled
          />
          <TextField
            margin="dense"
            label="Alert Price"
            type="number"
            fullWidth
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePriceAlertSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAlertsDialog} onClose={handleAlertsDialogClose}>
        <DialogTitle>Your Price Alerts</DialogTitle>
        <DialogContent>
            {loading ? ( // Show a loading message if fetching data
                <Typography>Loading price alerts...</Typography>
            ) : alerts.length > 0 ? (
                alerts.map((alert) => (
                    <Box
                        key={alert.id}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                        p={2}
                        sx={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            backgroundColor: "#f9f9f9",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {alert.stockSymbol}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#666" }}>
                                Condition: {alert.condition}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#666" }}>
                                Target Price: ${alert.targetPrice}
                            </Typography>
                        </Box>
                        <DeleteIcon
                            onClick={() => deletePriceAlert(alert.id)}
                            style={{ cursor: "pointer", color: "red" }}
                        />
                    </Box>
                ))
            ) : (
                <Typography>No price alerts found.</Typography>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleAlertsDialogClose} variant="contained" color="primary">
                Close
            </Button>
        </DialogActions>
    </Dialog>
    <Dialog open={openAIRecDialog} onClose={handleAIRecDialogClose}>
      <DialogTitle>AI Recommendation</DialogTitle>
      <DialogContent>
        {loadingAIRec ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Stock: {aiRecStock}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "10px" }}>
              Recommendation: {aiRecResponse}
            </Typography>
            <Typography variant="body2">
              Reasoning: {reasoning || "No reasoning available."}
            </Typography>
          </Box>
        )}
      </DialogContent>


      <DialogActions>
        <Button onClick={handleAIRecDialogClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>




    </Box>
  );
};

export default Watchlist;
