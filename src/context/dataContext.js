import { createContext, useState, useEffect } from "react";
import localforage from "localforage";
import { fetchData } from "../services/dataService";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const cachedData = await localforage.getItem("truckingData");
        if (cachedData) {
          setData(cachedData);
        } else {
          const fetchedData = await fetchData();
          setData(fetchedData);
          await localforage.setItem("truckingData", fetchedData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading }}>
      {children}
    </DataContext.Provider>
  );
};
