import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataContext } from "../context/dataContext";
import DataTable from "../components/DataTable";
import DataChart from "../components/DataChart";
import PivotTable from "../components/PivotTable";
import ActionButtons from "../components/ActionButtons";
import ViewToggle from "../components/ViewToggle";
import { CircularProgress, Container, Typography, Box } from "@mui/material";

const MainView = () => {
  const { data, loading } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      { Header: "Created Date", accessor: "created_dt" },
      { Header: "Entity Type", accessor: "entity_type" },
      { Header: "Legal Name", accessor: "legal_name" },
      { Header: "Physical Address", accessor: "physical_address" },
      { Header: "USDOT Number", accessor: "usdot_number" },
      { Header: "Power Units", accessor: "power_units" },
      { Header: "Drivers", accessor: "drivers" },
      { Header: "Out of Service Date", accessor: "out_of_service_date" },
      { Header: "Record Status", accessor: "record_status" },
    ],
    []
  );

  const urlParams = new URLSearchParams(location.search);

  const [tableView, setTableView] = useState({
    pageIndex: parseInt(urlParams.get("pageIndex"), 10) || 0,
    pageSize: parseInt(urlParams.get("pageSize"), 10) || 10,
    globalFilter: urlParams.get("globalFilter") || "",
  });

  const viewMode = urlParams.get("viewMode") || "table";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("pageIndex", tableView.pageIndex);
    params.set("pageSize", tableView.pageSize);
    params.set("globalFilter", tableView.globalFilter || "");
    params.set("viewMode", viewMode);
    navigate({ search: params.toString() });
  }, [tableView, viewMode, navigate]);

  const handleViewModeChange = (newViewMode) => {
    const params = new URLSearchParams(location.search);
    params.set("viewMode", newViewMode);
    navigate({ search: params.toString() });
  };

  return (
    <Container maxWidth="xl" sx={{ padding: "0 20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Trucking Dashboard</Typography>
        <ViewToggle viewMode={viewMode} setViewMode={handleViewModeChange} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ActionButtons tableView={tableView} />
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: "auto", width: "100%" }}>
          <Box
            sx={{
              ...{ display: viewMode === "table" ? "block" : "none" },
            }}
          >
            <DataTable
              columns={columns}
              data={data}
              initialState={tableView}
              onViewChange={setTableView}
            />
            <DataChart data={data} />
          </Box>

          <Box
            sx={{
              maxWidth: "100%",
              ...{ display: viewMode === "pivot" ? "block" : "none" },
            }}
          >
            <PivotTable data={data} />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default MainView;
