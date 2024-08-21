import axios from "axios";
import Papa from "papaparse";

const DATA_URL =
  "https://docs.google.com/spreadsheets/d/1hB_LjBT9ezZigXnC-MblT2PXZledkZqBnvV23ssfSuE/gviz/tq?tqx=out:csv";

export const fetchData = async () => {
  try {
    const response = await axios.get(DATA_URL);
    const csvData = response.data;

    // Parse the CSV data
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
