import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/loader/Loader";
import ProductList from "./pages/product-list/product-list";
import CustomerList from "./pages/customer-list/customer-list";
import SalesEntry from "./pages/sales-entry/sales-entry";
import Reports from "./pages/reports/reports";
import UserManagement from "./pages/user-management/user-management";
import UserLayout from "./pages/user-management";
import AddNewUser from "./pages/user-management/add-new-user";
import UpdateUser from "./pages/user-management/update-user";
import ProductLayout from "./pages/product-list";
import AddNewProduct from "./pages/product-list/add-new-product";
import UpdateProduct from "./pages/product-list/update-product";
import CustomerLayout from "./pages/customer-list";
import AddNewCustomer from "./pages/customer-list/add-new-customer";
import UpdateCustomer from "./pages/customer-list/update-customer";
import SalesEntryLayout from "./pages/sales-entry";
import AddNewSales from "./pages/sales-entry/add-new-sales";
import UpdateSales from "./pages/sales-entry/update-sales";
import ReportsLayout from "./pages/reports";
import InventoryReport from "./pages/reports/inventory-report";
import SalesReport from "./pages/reports/sales-report";
import ProfitReport from "./pages/reports/profit";

const RootLayout = lazy(() => import("./layout/RootLayout"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const LoginPage = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Dashboard />} />

          {/* report */}
          <Route path="reports" element={<ReportsLayout />}>
            <Route index element={<Reports />} />
            <Route path="inventory" element={<InventoryReport />} />
            <Route path="sales" element={<SalesReport />} />
            <Route path="profit" element={<ProfitReport />} />
          </Route>

          {/* sales entry */}
          <Route path="sales-entry" element={<SalesEntryLayout />}>
            <Route index element={<SalesEntry />} />
            <Route path="add-new-sale" element={<AddNewSales />} />
            <Route path="update-sale/:id" element={<UpdateSales />} />
          </Route>

          {/* customer */}
          <Route path="customer-list" element={<CustomerLayout />}>
            <Route index element={<CustomerList />} />
            <Route path="add-new-customer" element={<AddNewCustomer />} />
            <Route path="update-customer/:id" element={<UpdateCustomer />} />
          </Route>

          {/* product */}
          <Route path="product-list" element={<ProductLayout />}>
            <Route index element={<ProductList />} />
            <Route path="add-new-product" element={<AddNewProduct />} />
            <Route path="update-product/:id" element={<UpdateProduct />} />
          </Route>

          {/* user */}
          <Route path="user-management" element={<UserLayout />}>
            <Route index element={<UserManagement />} />
            <Route path="add-new-user" element={<AddNewUser />} />
            <Route path="update-user/:id" element={<UpdateUser />} />
          </Route>

        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
