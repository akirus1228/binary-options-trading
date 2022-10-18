// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NxWelcome from "./nx-welcome";

import { Route, Routes } from "react-router-dom";

export function App() {
  return (
    <>
      <NxWelcome title="options" />
      <Routes>
        <Route path="/" element={<div>Hello, Options</div>} />
      </Routes>
    </>
  );
}

export default App;
