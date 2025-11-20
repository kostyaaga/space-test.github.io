import { Route, Routes } from "react-router-dom";

import Header from "./components/Header/idnex";
import Home from "./pages/Home";
import ItemsDetails from "./pages/ItemsDetails";
import CreateItem from "./pages/CreateItem";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Header></Header>
      <Routes>
        <Route path="/space-test/" element={<Home />} />
        <Route path="/create_item" element={<CreateItem />} />
        <Route path="/item/:id" element={<ItemsDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
