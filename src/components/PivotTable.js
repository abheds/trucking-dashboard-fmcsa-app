import { useState, useEffect } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import Plot from "react-plotly.js";
import TableRenderers from "react-pivottable/TableRenderers";

const PlotlyRenderers = createPlotlyRenderers(Plot);

const PivotTable = ({ data, onViewChange }) => {
  const [pivotState, setPivotState] = useState({
    data: [],
    rows: ["entity_type"],
    cols: ["out_of_service_date"],
    rendererName: "Table",
  });

  useEffect(() => {
    const filteredData = data.filter((d) =>
      Object.values(d).some((value) => value !== undefined && value !== null)
    );

    if (filteredData.length) {
      setPivotState((prevState) => ({
        ...prevState,
        data: filteredData,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (onViewChange) {
      onViewChange(pivotState);
    }
  }, [pivotState, onViewChange]);

  return (
    pivotState.data.length > 0 && (
      <PivotTableUI
        data={pivotState.data}
        onChange={(s) => setPivotState(s)}
        renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
        {...pivotState}
      />
    )
  );
};

export default PivotTable;
