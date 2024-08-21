import { Button } from "@mui/material";
import { saveView, loadView, resetView } from "../utils/viewStorage";
import { useLocation } from "react-router-dom";

const ActionButtons = ({ tableView, setTableView }) => {
  const location = useLocation();
  const handleSaveView = () => {
    saveView({ tableView });
  };

  const handleLoadView = async () => {
    const savedView = await loadView();
    if (savedView) {
      setTableView(savedView);
    }
  };

  const handleResetView = () => {
    resetView();
    setTableView(null);
  };

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.search = location.search;
    navigator.clipboard.writeText(url.toString()).then(() => {
      alert("Shareable link copied to clipboard!");
    });
  };

  return (
    <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
      <Button variant="contained" color="primary" onClick={handleSaveView}>
        Save View
      </Button>
      <Button variant="contained" color="primary" onClick={handleLoadView}>
        Load View
      </Button>
      <Button variant="contained" color="primary" onClick={handleResetView}>
        Reset to Default
      </Button>
      <Button variant="contained" color="secondary" onClick={handleCopyLink}>
        Copy Shareable Link
      </Button>
    </div>
  );
};

export default ActionButtons;
