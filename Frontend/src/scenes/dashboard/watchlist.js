// // import { Box, Typography, useTheme, Button } from "@mui/material";
// // import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// // import { tokens } from "../../theme";
// // import Icon from "@mui/material/Icon";
// // import { mockDataTeam } from "../../data/mockData";
// // import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// // import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
// // import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
// // import DeleteIcon from "@mui/icons-material/Delete";
// // import Header from "../../components/Headers";
// // // import { abc } from "../../mockData";
// // import { useEffect, useState, useCallback } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // // import { useAuthContext } from "../../hooks/useAuthContext.jsx";
// // import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// // import { CleaningServices } from "@mui/icons-material";
// // import React from "react";

// // const Watchlist = () => {
// //   // const { user } = useAuthContext();
// //   const user = JSON.parse(localStorage.getItem("user"));
// //   // console.log(user);
// //   const history = useNavigate();
// //   // const [abc, setAbc] = useState([]);
// //   const [rows, setRows] = useState([]);

// //   // const [rows: GridRowsProp, setRows] = React.useState([]);
// //   const [isLoading, setIsLoading] = useState(true);

// //   const url = "http://localhost:8080/temp/".concat(user.id);
// //   // console.log(url);

// //   const fetchData = async () => {
// //     let abc = [];
// //     const temp = [];

// //     await fetch(url)
// //       .then((response) => response.json())
// //       // .then((response) => setAbc(response));
// //       .then((response) => {
// //         response.map((d) => abc.push(d));
// //       });
// //     // console.log(abc);
// //     for (var key in abc) {
// //       if (!abc.hasOwnProperty(key)) continue;
// //       let newData = [];
// //       const url = "https://finnhub.io/api/v1/quote?symbol=".concat(
// //         abc[key].symbol,
// //         "&token=ce80b8aad3i4pjr4v2ggce80b8aad3i4pjr4v2h0"
// //       );
// //       await axios
// //         .get(url)
// //         .then((res) => {
// //           const pData = res.data;
// //           newData.push(pData);
// //         })
// //         .catch((err) => {
// //           console.log(err);
// //         });
// //       // console.log(newData);

// //       const ab = {
// //         id: abc[key]._id,
// //         name: abc[key].name,
// //         symbol: abc[key].symbol,
// //         delete: abc[key]._id,
// //         ids: abc[key]._id,
// //         today: newData[0]["c"],
// //         Percent: newData[0]["dp"] + " %",
// //         open: newData[0]["o"],
// //         high: newData[0]["h"],
// //         low: newData[0]["l"],
// //         close: newData[0]["pc"],
// //       };
// //       // console.log(pData[key].name)
// //       let flag = false;
// //       for (var k in temp) {
// //         if (temp[k].symbol === abc[key].symbol) {
// //           flag = true;
// //         }
// //       }
// //       if (!flag) {
// //         temp.push(ab);
// //       }
// //     }
// //     console.log(temp);
// //     const s = new Set(temp);
// //     // console.log(s);
// //     setRows(Array.from(s));
// //     // setIsLoading(false);
// //   };

// //   useEffect(() => {
// //     // abc = [];
// //     // temp = [];
// //     fetchData();
// //   }, []);

// //   const theme = useTheme();
// //   const colors = tokens(theme.palette.mode);
// //   const columns = [
// //     {
// //       field: "name",
// //       headerName: " Company Name",
// //       flex: 1,
// //       cellClassName: "name-column--cell",
// //     },
// //     {
// //       field: "symbol",
// //       headerName: "Symbol",
// //       flex: 0.5,
// //       cellClassName: "symbol-column--cell",
// //     },
// //     {
// //       field: "ids",
// //       headerName: "ids",
// //       hide: true,
// //       flex: 0.5,

// //       cellClassName: "symbol-column--cell",
// //     },

// //     {
// //       field: "today",
// //       headerName: "Current Price",
// //       flex: 0.5,
// //       type: "number",
// //       headerAlign: "left",
// //       align: "left",
// //     },
// //     {
// //       field: "Percent",
// //       headerName: "Percent Chamge",
// //       flex: 0.5,
// //       type: "number",
// //       headerAlign: "left",
// //       align: "left",
// //     },
// //     {
// //       field: "open",
// //       headerName: "Open",
// //       flex: 0.3,
// //       type: "number",
// //       headerAlign: "left",
// //       align: "left",
// //     },
// //     {
// //       field: "high",
// //       headerName: "High",
// //       flex: 0.3,
// //       type: "number",
// //       headerAlign: "left",
// //       align: "left",
// //     },
// //     {
// //       field: "low",
// //       headerName: "Low",
// //       flex: 0.3,
// //       type: "number",
// //       headerAlign: "left",
// //       align: "left",
// //     },
// //     {
// //       field: "close",
// //       headerName: "Close",
// //       flex: 0.3,
// //       type: "number",
// //       headerAlign: "left",
// //       align: "left",
// //     },

// //     {
// //       field: "Buy",
// //       headerName: "Buy",
// //       sortable: false,
// //       renderCell: (params) => {
// //         const Add = (e) => {
// //           e.stopPropagation(); // don't select this row after clicking

// //           const api: GridApi = params.api;
// //           const thisRow: Record<string, GridCellValue> = {};

// //           api
// //             .getAllColumns()
// //             .filter((c) => c.field !== "__check__" && !!c)
// //             .forEach(
// //               (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
// //             );
// //           console.log(thisRow);
// //           history("/buyStock", { state: thisRow });
// //           return;
// //         };

// //         return (
// //           <Button onClick={Add} variant="contained" color="success">
// //             Buy
// //           </Button>
// //         );
// //       },
// //     },
// //     {
// //       field: "Sell",
// //       headerName: "Sell",
// //       sortable: false,
// //       renderCell: (params) => {
// //         const Remove = (e) => {
// //           e.stopPropagation(); // don't select this row after clicking

// //           const api: GridApi = params.api;
// //           const thisRow: Record<string, GridCellValue> = {};

// //           api
// //             .getAllColumns()
// //             .filter((c) => c.field !== "__check__" && !!c)
// //             .forEach(
// //               (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
// //             );

// //           // return alert(JSON.stringify(thisRow.name, null, 4));
// //           // return;
// //           console.log(thisRow);
// //           history("/sellStock", { state: thisRow });
// //         };

// //         return (
// //           <Button onClick={Remove} variant="outlined" color="error">
// //             Sell
// //           </Button>
// //         );
// //       },
// //     },

// //     {
// //       field: "Delete",
// //       headerName: "Delete",

// //       sortable: false,
// //       renderCell: (params) => {
// //         const Delete = (e) => {
// //           e.stopPropagation(); // don't select this row after clicking

// //           const api: GridApi = params.api;
// //           const thisRow: Record<string, GridCellValue> = {};

// //           api
// //             .getAllColumns()
// //             .filter((c) => c.field !== "__check__" && !!c)
// //             .forEach(
// //               (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
// //             );

// //           async function deleteRow() {
// //             await fetch("http://localhost:8080/temp/".concat(thisRow.ids), {
// //               method: "DELETE",
// //             });
// //             for (var key in rows) {
// //               const a = rows[key];
// //               setRows((rows) => rows.filter((a) => a.ids != thisRow.ids));
// //             }
// //           }
// //           deleteRow();

// //           // console.log(thisRow);
// //           // return alert(
// //           //   JSON.stringify(thisRow.symbol, null, 4) + " " + "Deleted"
// //           // );
// //           // //
// //         };

// //         return <DeleteIcon onClick={Delete}></DeleteIcon>;
// //       },
// //     },
// //     {
// //       field: "Details",
// //       headerName: "Details",
// //       sortable: false,
// //       renderCell: (params) => {
// //         const Details = (e) => {
// //           e.stopPropagation(); // don't select this row after clicking

// //           const api: GridApi = params.api;
// //           const thisRow: Record<string, GridCellValue> = {};

// //           api
// //             .getAllColumns()
// //             .filter((c) => c.field !== "__check__" && !!c)
// //             .forEach(
// //               (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
// //             );
// //           // console.log(thisRow);
// //           history("/details", { state: thisRow });
// //           return;
// //         };

// //         return <AddCircleOutlineIcon onClick={Details}></AddCircleOutlineIcon>;
// //       },
// //     },
// //   ];

// //   return (
// //     <>
// //       {/* {isLoading && <h1>Loading Data...</h1>} */}
// //       <Box m="20px">
// //         {/* <Header title="Watchlist" /> */}
// //         <Header title="Watchlist" subtitle="Watchlist" />
// //         <Box
// //           m="40px 0 0 0"
// //           height="75vh"
// //           sx={{
// //             "& .MuiDataGrid-root": {
// //               border: "none",
// //             },
// //             "& .MuiDataGrid-cell": {
// //               borderBottom: "none",
// //             },
// //             "& .name-column--cell": {
// //               color: colors.greenAccent[300],
// //             },
// //             "& .MuiDataGrid-columnHeaders": {
// //               backgroundColor: colors.blueAccent[700],
// //               borderBottom: "none",
// //             },
// //             "& .MuiDataGrid-virtualScroller": {
// //               backgroundColor: colors.primary[400],
// //             },
// //             "& .MuiDataGrid-footerContainer": {
// //               borderTop: "none",
// //               backgroundColor: colors.blueAccent[700],
// //             },
// //             "& .MuiCheckbox-root": {
// //               color: `${colors.greenAccent[200]} !important`,
// //             },
// //           }}
// //         >
// //           {rows && (
// //             <DataGrid
// //               rows={rows}
// //               columns={columns}
// //               components={{ Toolbar: GridToolbar }}
// //             />
// //           )}
// //         </Box>
// //       </Box>
// //     </>
// //   );
// // };

// // export default Watchlist;




// //FIREBASE SETUP
// import { Box, Typography, Button } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import { useTheme } from "@mui/material"; // Ensure this is imported
// import Icon from "@mui/material/Icon";
// import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
// import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Header from "../../components/Headers";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { db } from "../../firebaseConfig"; // Import Firebase client config here
// import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"; // Firestore functions

// const Watchlist = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user && user.uid;  // Assuming `uid` is used instead of `id` for Firebase users
//   const [rows, setRows] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const history = useNavigate();
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   const fetchData = async () => {
//     if (!userId) {
//       console.error("User ID is undefined");
//       return;
//     }

//     try {
//       const watchlistRef = collection(db, "temp");
//       const snapshot = await getDocs(watchlistRef);
      
//       const watchlistData = await Promise.all(
//         snapshot.docs.map(async (doc) => {
//           const item = { id: doc.id, ...doc.data() };
          
//           // Fetch live stock data using the stock symbol
//           const stockUrl = `https://finnhub.io/api/v1/quote?symbol=${item.symbol}&token=your_finnhub_api_key`;
//           const stockResponse = await axios.get(stockUrl);
//           const stockData = stockResponse.data;

//           return {
//             id: item.id,
//             name: item.name,
//             symbol: item.symbol,
//             today: stockData.c,
//             Percent: stockData.dp + " %",
//             open: stockData.o,
//             high: stockData.h,
//             low: stockData.l,
//             close: stockData.pc,
//           };
//         })
//       );

//       setRows(watchlistData);
//     } catch (error) {
//       console.error("Error fetching watchlist data from Firebase:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Function to delete an item from Firestore
//   const deleteRow = async (id) => {
//     try {
//       await deleteDoc(doc(db, "temp", id));
//       setRows(rows.filter((row) => row.id !== id));
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   // Columns definition remains the same
//   const columns = [
//     { field: "name", headerName: "Company Name", flex: 1 },
//     { field: "symbol", headerName: "Symbol", flex: 0.5 },
//     { field: "today", headerName: "Current Price", flex: 0.5, type: "number" },
//     { field: "Percent", headerName: "Percent Change", flex: 0.5, type: "number" },
//     { field: "open", headerName: "Open", flex: 0.3, type: "number" },
//     { field: "high", headerName: "High", flex: 0.3, type: "number" },
//     { field: "low", headerName: "Low", flex: 0.3, type: "number" },
//     { field: "close", headerName: "Close", flex: 0.3, type: "number" },
//     {
//       field: "Buy",
//       headerName: "Buy",
//       sortable: false,
//       renderCell: (params) => (
//         <Button
//           onClick={() => history("/buyStock", { state: params.row })}
//           variant="contained"
//           color="success"
//         >
//           Buy
//         </Button>
//       ),
//     },
//     {
//       field: "Sell",
//       headerName: "Sell",
//       sortable: false,
//       renderCell: (params) => (
//         <Button
//           onClick={() => history("/sellStock", { state: params.row })}
//           variant="outlined"
//           color="error"
//         >
//           Sell
//         </Button>
//       ),
//     },
//     {
//       field: "Delete",
//       headerName: "Delete",
//       sortable: false,
//       renderCell: (params) => (
//         <DeleteIcon
//           onClick={() => deleteRow(params.row.id)}
//           style={{ cursor: "pointer", color: "red" }}
//         />
//       ),
//     },
//     {
//       field: "Details",
//       headerName: "Details",
//       sortable: false,
//       renderCell: (params) => (
//         <AddCircleOutlineIcon
//           onClick={() => history("/details", { state: params.row })}
//           style={{ cursor: "pointer" }}
//         />
//       ),
//     },
//   ];

//   return (
//     <Box m="20px">
//       <Header title="Watchlist" subtitle="Watchlist" />
//       <Box
//         m="40px 0 0 0"
//         height="75vh"
//         sx={{
//           "& .MuiDataGrid-root": { border: "none" },
//           "& .MuiDataGrid-cell": { borderBottom: "none" },
//           "& .name-column--cell": { color: colors.greenAccent[300] },
//           "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
//           "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
//           "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
//           "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
//         }}
//       >
//         <DataGrid
//           rows={rows}
//           columns={columns}
//           components={{ Toolbar: GridToolbar }}
//           loading={isLoading}
//         />
//       </Box>
//     </Box>
//   );
// };



// export default Watchlist;

import { Box, Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import Header from "../../components/Headers";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Watchlist = () => {
  const storedData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = storedData?.id; // Retrieve the user ID from localStorage

  const [rows, setRows] = useState([]); // Watchlisted stocks
  const [isLoading, setIsLoading] = useState(true);
  const history = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Fetch watchlisted stocks for the current user
  const fetchWatchlist = async () => {
    // Retrieve user ID and client ID from localStorage
    const user = JSON.parse(localStorage.getItem("user")) || null;
    const selectedClient = JSON.parse(localStorage.getItem("selectedClient")) || null;

    const userId = user?.id; // Ensure the userId is valid
    const clientId = selectedClient?.id || selectedClient; // Ensure the clientId is valid

    if (!userId || !clientId) {
        console.error("User ID or Client ID is missing or undefined.");
        alert("User ID or Client ID is missing. Please log in again.");
        return;
    }

    try {
        const response = await axios.get(
            `https://act-production-5e24.up.railway.app/api/watchlist/${userId}/${clientId}`
        );
        console.log("Fetched watchlist:", response.data);

        const transformedData = await Promise.all(
            response.data.map(async (stock, index) => {
                try {
                    const stockUrl = `https://finnhub.io/api/v1/quote?symbol=${stock.ticker}&token=ce80b8aad3i4pjr4v2ggce80b8aad3i4pjr4v2h0`;
                    const stockResponse = await axios.get(stockUrl);
                    const stockData = stockResponse.data;

                    return {
                        id: index, // Unique ID for DataGrid
                        name: stock.ticker, // Placeholder for company name (adjust if needed)
                        symbol: stock.ticker, // Symbol of the stock
                        today: stockData.c || "N/A", // Current price
                        Percent: stockData.dp ? `${stockData.dp}%` : "N/A", // Percent change
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
        console.error("Error fetching watchlist:", error.response?.data || error.message);
    } finally {
        setIsLoading(false);
    }
};


  // Delete a stock from the user's watchlist
  const deleteWatchlistItem = async (stockTicker) => {
    try {
      await axios.delete("https://act-production-5e24.up.railway.app/api/watchlist/remove", {
        data: { userId, stockTicker },
      });
      console.log(`Removed ${stockTicker} from watchlist.`);

      // Update the rows state
      setRows((prevRows) => prevRows.filter((row) => row.ticker !== stockTicker));
    } catch (error) {
      console.error("Error removing stock from watchlist:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const columns = [
    { field: "name", headerName: "Company Name", flex: 1 },
    { field: "symbol", headerName: "Symbol", flex: 0.5 },
    { field: "today", headerName: "Current Price", flex: 0.5, type: "number" },
    { field: "Percent", headerName: "Percent Change", flex: 0.5, type: "number" },
    { field: "open", headerName: "Open", flex: 0.3, type: "number" },
    { field: "high", headerName: "High", flex: 0.3, type: "number" },
    { field: "low", headerName: "Low", flex: 0.3, type: "number" },
    { field: "close", headerName: "Close", flex: 0.3, type: "number" },
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
    </Box>
  );
};

export default Watchlist;

