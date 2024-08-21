import localforage from "localforage";

const VIEW_KEY = "userTableView";

export const saveView = async (viewState) => {
  try {
    console.log({ viewState });
    await localforage.setItem(VIEW_KEY, viewState);
    alert("View saved successfully!");
  } catch (error) {
    console.error("Error saving view:", error);
  }
};

export const loadView = async () => {
  try {
    const savedView = await localforage.getItem(VIEW_KEY);
    if (savedView) {
      alert("View loaded successfully!");
    }
    return savedView || null;
  } catch (error) {
    console.error("Error loading view:", error);
    return null;
  }
};

export const resetView = async () => {
  try {
    await localforage.removeItem(VIEW_KEY);
    alert("View reset to default!");
  } catch (error) {
    console.error("Error resetting view:", error);
  }
};
