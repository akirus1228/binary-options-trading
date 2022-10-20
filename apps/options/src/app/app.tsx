import { Route, Routes } from "react-router-dom";

export function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<div className="text-center bg-danger">Hello, Options</div>}
        />
      </Routes>
    </div>
  );
}

export default App;
