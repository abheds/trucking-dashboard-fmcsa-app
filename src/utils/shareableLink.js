import qs from "qs";

export const generateShareableLink = ({ tableView }) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams();

  if (tableView) {
    params.set("pageIndex", tableView.pageIndex);
    params.set("pageSize", tableView.pageSize);
    params.set("globalFilter", tableView.globalFilter || "");
  }

  url.search = params.toString();
  return url.toString();
};

export const parseShareableLink = () => {
  const queryString = window.location.search.substring(1);
  const viewState = qs.parse(queryString);
  return viewState;
};
