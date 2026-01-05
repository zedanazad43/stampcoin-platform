import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Investors from "./pages/Investors";
import Contact from "./pages/Contact";
import Marketplace from "./pages/Marketplace";
import StampDetail from "./pages/StampDetail";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import PaymentResult from "./pages/PaymentResult";
import ExpertApplication from "./pages/ExpertApplication";
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertLeaderboard from "./pages/ExpertLeaderboard";
import PartnershipProposal from "./pages/PartnershipProposal";
import PartnerDashboard from "./pages/PartnerDashboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/stamp/:id"} component={StampDetail} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/about"} component={About} />
      <Route path={"/investors"} component={Investors} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/partners"} component={Partners} />
      <Route path={"/expert/apply"} component={ExpertApplication} />
      <Route path={"/expert/dashboard"} component={ExpertDashboard} />
      <Route path={"/expert/leaderboard"} component={ExpertLeaderboard} />
      <Route path={"/partnership/propose"} component={PartnershipProposal} />
      <Route path={"/partnership/dashboard"} component={PartnerDashboard} />
      <Route path={"payment-result"} component={PaymentResult} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
