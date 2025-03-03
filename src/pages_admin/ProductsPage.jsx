import { useState , useEffect} from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import ProductModal from '../component_admin/ProductModal';
import Pagination from '../component_admin/Pagination';
import { useDispatch , useSelector } from 'react-redux';
import { createMessage } from '../redux/toastSlice';
import { setScreenLoadingStart , setScreenLoadingEnd } from "../redux/loadingSlice";
import { editProduct } from '../redux/modalStateSlice';

const { VITE_BASE_URL , VITE_API_PAHT } = import.meta.env;

export default function ProductPage () {
  const dispatch = useDispatch()

  // 產品資料狀態
  const [ products , setProducts ] = useState([]);
  // 產品分頁狀態
  const [ pagination , setPagination ] = useState([])
  // 取得產品資料
  const getProducts = async (page = 1) => {
    dispatch(setScreenLoadingStart())
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      const {success , message} = error.response.data
      dispatch(createMessage({
        text: message,
        status: success ? "success" : "failed"
      }))
    } finally {
      dispatch(setScreenLoadingEnd())
    }
  }

  // 初始化取資料
  useEffect(() => {
    // 從cookie取token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
    // 將token放入axios.headers
    axios.defaults.headers.common['Authorization'] = token;

    getProducts();
  },[])

  // Modal開關功能
  const handleOpenProductModal = ( mode , product ) => {
    const state = {
      mode,
      product
    }
    dispatch(editProduct(state))
  };
  
  // 刪除產品
  const deleteProduct = async (product) => {
    dispatch(setScreenLoadingStart())
    try {
      const id = product.id;
      const res = await axios.delete(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/admin/product/${id}`)
      const {success , message} = res.data
      dispatch(createMessage({
        text: message,
        status: success ? "success" : "failed"
      }))
      getProducts()
    } catch (error) {
      const {success , message} = error.response.data
      dispatch(createMessage({
        text: message,
        status: success ? "success" : "failed"
      }))
    } finally {
      dispatch(setScreenLoadingStart())
    }
  }
  
  const handleDeleteProduct = (product) => {
    Swal.fire({
      title: "確認要刪除？",
      text: "刪除後將無法復原",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確認",
      cancelButtonText: "取消"
    }).then((result) => {
      // isConfirmed為true，才會執行刪除功能
      if (result.isConfirmed) {
        deleteProduct(product);
      }
    });
  }

  return (
    <>
      <div className="container mt-5 mb-3">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2 className="fw-bolder">產品列表</h2>
              <button type="button" className="btn btn-primary fw-bolder" onClick={()=>handleOpenProductModal('create')}>建立新的產品</button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">冷飲</th>
                  <th scope="col">熱飲</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="align-middle">
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td className="fw-bolder">{product.is_enabled ? (<span className="text-success">啟用</span>) : (<span>未啟用</span>)}</td>
                    <td>{product.can_ice ? (<i className="bi bi-snow2 text-primary"></i>):(<></>)}</td>
                    <td>{product.can_hot ? (<i className="bi bi-fire text-danger"></i>):(<></>)}</td>
                    <td className="text-end">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-primary" onClick={()=>handleOpenProductModal('edit' , product)}>編輯</button>
                        <button type="button" className="btn btn-outline-danger" onClick={()=>handleDeleteProduct(product)}>刪除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Pagination 
        products={products}
        pageInfo={pagination}
        getProducts={getProducts}
      />

      <ProductModal
        getProducts={getProducts}
      />
    </>
  )
}