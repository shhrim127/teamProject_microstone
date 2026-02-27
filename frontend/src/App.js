import { RouterProvider } from 'react-router-dom';
import './App.css';
import root from './router/root';
import { UserProvider } from "./store/UserContext";

const App = () => {
  return (
    <UserProvider>
        <RouterProvider router={root} />
    </UserProvider>
  );
};

export default App;
