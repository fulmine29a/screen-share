import React from "react";
import { createRoot } from "react-dom/client";
import { Wrappers } from "./components/wrappers";

const root = createRoot(document.getElementById("root")!);
root.render(<Wrappers />);
