import { useContext, useState, useEffect, useMemo } from "react";
import { DataContext } from "../context/dataContext";
import DataTable from "../components/DataTable";
import DataChart from "../components/DataChart";
import PivotTable from "../components/PivotTable";
import ActionButtons from "../components/ActionButtons";
import ViewToggle from "../components/ViewToggle";
import { CircularProgress, Container, Typography, Box } from "@mui/material";
import { loadView } from "../utils/viewStorage";
import localforage from "localforage";

const MainView = () => {
  const { data, loading } = useContext(DataContext);
  const [tableView, setTableView] = useState(null);
  const [viewMode, setViewMode] = useState("table");

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

  useEffect(() => {
    async function setLocal(params) {
      await localforage.setItem("local", params);
    }

    setLocal(tableView);
  }, [tableView]);

  useEffect(() => {
    const fetchView = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const savedView = {
        pageIndex: parseInt(urlParams.get("pageIndex"), 10) || 0,
        pageSize: parseInt(urlParams.get("pageSize"), 10) || 10,
        globalFilter: urlParams.get("globalFilter") || "",
      };

      if (savedView.pageIndex !== null || savedView.pageSize !== null) {
        setTableView(savedView);
      } else {
        const storedView = await loadView();
        if (storedView) {
          setTableView(storedView);
        }
      }
    };

    fetchView();
  }, []);

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
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <ActionButtons tableView={tableView} setTableView={setTableView} />
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
          {viewMode === "table" && (
            <>
              <DataTable
                columns={columns}
                data={data}
                onViewChange={setTableView}
              />
              <DataChart data={data} />
            </>
          )}
          {viewMode === "pivot" && (
            <Box sx={{ maxWidth: "100%" }}>
              <PivotTable data={data} onViewChange={setTableView} />
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
};

export default MainView;
