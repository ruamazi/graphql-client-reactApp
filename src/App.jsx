import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Transaction from "./pages/Transaction";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) {
    return null;
  }

  return (
    <>
      {data?.authUser && <Header />}
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={data?.authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!data?.authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!data?.authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/transaction/:id"
          element={data?.authUser ? <Transaction /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
