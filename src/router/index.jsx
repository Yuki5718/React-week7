import { createHashRouter } from 'react-router-dom'
import Layout from '../layouts/Layout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import Cart from '../pages/Cart';
import ProductDetail from '../pages/ProductDetail';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import NotFound from '../pages/NotFound';
import AdminLayout from '../layouts/AdminLayout';
import AdminHome from '../pages_admin/AdminHome';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path:'',
        element: <Home />,
        children: [
          {
            path:'/user/:id',
            element: <Home />
          },
        ]
      },
      {
        path:'products',
        element: <Products />,
        children: [
          {
            path:'products/:id',
            element: <ProductDetail />
          },
        ]
      },
      {
        path:'cart',
        element: <Cart />
      },
      {
        path:'login',
        element: <Login />
      },
      {
        path:'logout',
        element: <Logout />
      },
      
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <AdminHome />
      }
    ]
  },
  {
    path:'*',
    element: <NotFound />
  }
])

export default router;