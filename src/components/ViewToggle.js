import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const ViewToggle = ({ viewMode, setViewMode }) => {
  const handleViewModeChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={handleViewModeChange}
      aria-label="view mode"
      style={{ margin: "20px 0" }}
    >
      <ToggleButton value="table" aria-label="table view">
        Table View
      </ToggleButton>
      <ToggleButton value="pivot" aria-label="pivot table view">
        Pivot Table View
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewToggle;
