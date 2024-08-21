import { Button } from "@mui/material";
import { saveView, loadView, resetView } from "../utils/viewStorage";
import { generateShareableLink } from "../utils/shareableLink";

const ActionButtons = ({ tableView, setTableView }) => {
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

  const handleShareLink = () => {
    const link = generateShareableLink({ tableView });
    prompt("Copy this shareable link:", link);
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
      <Button variant="contained" color="secondary" onClick={handleShareLink}>
        Get Shareable Link
      </Button>
    </div>
  );
};

export default ActionButtons;
