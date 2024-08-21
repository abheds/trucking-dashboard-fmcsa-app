import { DataProvider } from "./context/dataContext";
import MainView from "./views/MainView";

function App() {
  return (
    <DataProvider>
      <MainView />
    </DataProvider>
  );
}

export default App;
