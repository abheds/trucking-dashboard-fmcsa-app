import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const ViewToggle = ({ viewMode, setViewMode }) => {
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
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
      <ToggleButton value="pivot" aria-label="pivot view">
        Pivot Table View
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ViewToggle;
