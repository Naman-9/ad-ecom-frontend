import { Suspense, lazy, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import Loader from './components/Loader';
import OrderDetails from './pages/OrderDetails';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { userExist, userNotExist } from './redux/reducer/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './redux/api/userAPI';
import { UserReducerInitialState } from './types/reducer-types';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';


const App = () => {
  
  const dispatch = useDispatch();
  const { user, loading } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer,
  );

  // Dynamic import - should know which one needs to be imported dynamically.
  // No need to load pages if we are not at it.
  const Home = lazy(() => import('./pages/Home'));
  const Login = lazy(() => import('./pages/Login'));
  const Search = lazy(() => import('./pages/Search'));
  const Cart = lazy(() => import('./pages/Cart'));
  const Shipping = lazy(() => import('./pages/Shipping'));
  const Orders = lazy(() => import('./pages/Orders'));
  const NotFound = lazy(() => import('./pages/NotFound'));
  
  // --------------Admin -----------------
  const Dashboard = lazy(() => import('./pages/admin/dashboard'));
  const Products = lazy(() => import('./pages/admin/products'));
  const Customers = lazy(() => import('./pages/admin/customers'));
  const Transaction = lazy(() => import('./pages/admin/transaction'));
  const Barcharts = lazy(() => import('./pages/admin/charts/barcharts'));
  const Piecharts = lazy(() => import('./pages/admin/charts/piecharts'));
  const Linecharts = lazy(() => import('./pages/admin/charts/linecharts'));
  const Coupon = lazy(() => import('./pages/admin/apps/coupon'));
  const Stopwatch = lazy(() => import('./pages/admin/apps/stopwatch'));
  const Toss = lazy(() => import('./pages/admin/apps/toss'));
  const NewProduct = lazy(() => import('./pages/admin/management/newproduct'));
  const ProductManagement = lazy(() => import('./pages/admin/management/productmanagement'));
  const Checkout = lazy(() => import('./pages/Checkout'));
  const TransactionManagement = lazy(
    () => import('./pages/admin/management/transactionmanagement'),
  );
  // --------------Admin -----------------

  useEffect(() => {
    // as auth change it triggers
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('---logged In');
        const data = await getUser(user.uid);
        dispatch(userExist(data?.user));
      } else {
        console.log('---not logged in---');
        dispatch(userNotExist());
      }
    });
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      {/* Header   */} {/* available to all*/}
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />

          {/* Not Logged In Route */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* Logged in User Routes */}
          <Route element={<ProtectedRoute isAuthenticated={user ? true : false} />}>
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/pay" element={<Checkout />} />

          </Route>

          {/* ---------------Admin-------------------- */}
          {/* ---------------Admin-------------------- */}
          {/* ---------------Admin-------------------- */}
          {/* ---------------Admin-------------------- */}

          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                isAdmin={user?.role === 'admin' ? true : false}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
            <Route path="/pay" element={<Checkout />} />
          </Route>
          {/* ---------------Admin-------------------- */}
          {/* ---------------Admin-------------------- */}
          {/* ---------------Admin-------------------- */}
          {/* ---------------Admin-------------------- */}

          <Route path='*' element = {<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </Router>
  );
};

export default App;
