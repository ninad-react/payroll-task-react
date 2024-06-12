import React from "react";
import PrivateRouting from "./router/PrivateRouting";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterProvider router={PrivateRouting} />
          <Toaster />
        </LocalizationProvider>
      </Provider>
    </div>
  );
};

export default App;
