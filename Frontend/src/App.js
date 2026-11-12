import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route, Outlet } from "react-router-dom";
import Topbar from "./global/Topbar";
import HamburgerMenu from "./global/HamburgerMenu";
import Dashboard from "./scenes/dashboard";
import Login from "./scenes/login/Login";
import Register from "./scenes/register/Register";
import WatchList from "./scenes/dashboard/watchlist";
import Details from "./scenes/dashboard/details";
import BuyStock from "./scenes/dashboard/buyStock";
import SellStock from "./scenes/dashboard/sellStock";
import LandingPage from "./global/LandingPage";
import Newz from "./scenes/dashboard/news";
import IPO from "./scenes/dashboard/ipo";
import Portfolio from "./scenes/dashboard/Portfolio";
import TradeHistory from "./scenes/dashboard/TradeHistory";
import Testimonials from "./global/Testimonials";
import Clients from "./scenes/dashboard/Clients"; // Import the Clients screen
import { RequireAuth, RequireClient } from "./components/RequireAuth";

function DashboardLayout() {
  return <div className="app"><HamburgerMenu /><main className="context"><Topbar /><Outlet /></main></div>;
}

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<RequireAuth />}>
            <Route path="/clients" element={<Clients />} />
            <Route element={<RequireClient />}>
              <Route element={<DashboardLayout />}>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/watchlist" element={<WatchList />} />
                <Route path="/details" element={<Details />} />
                <Route path="/news" element={<Newz />} />
                <Route path="/ipo" element={<IPO />} />
                <Route path="/buyStock" element={<BuyStock />} />
                <Route path="/sellStock" element={<SellStock />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/orders" element={<TradeHistory />} />
                <Route path="/testimonials" element={<Testimonials />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
