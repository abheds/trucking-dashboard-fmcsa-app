import { useEffect, useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { useDebounce } from "use-debounce";
import SearchIcon from "@mui/icons-material/Search";

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter);
  const [debouncedValue] = useDebounce(value, 300);

  useEffect(() => {
    setGlobalFilter(debouncedValue || undefined);
  }, [debouncedValue, setGlobalFilter]);

  return (
    <span>
      <TextField
        label="Search all columns"
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        variant="outlined"
        size="small"
        style={{ margin: "10px 0", width: "300px" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </span>
  );
};

export default GlobalFilter;
