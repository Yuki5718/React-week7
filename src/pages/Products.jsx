import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { createMessage } from '../redux/toastSlice';
import { setScreenLoadingStart , setScreenLoadingEnd , setBtnLoadingStart , setBtnLoadingEnd } from "../redux/loadingSlice";

const { VITE_BASE_URL , VITE_API_PAHT } = import.meta.env

export default function Products () {
  const dispatch = useDispatch()
  // 按鈕顯示Loading
  const isBtnLoading = useSelector((state) => state.loading.BtnLoading.isLoading)

  // 取得產品資料
  const [ products , setProducts ] = useState([])
  const getProducts = async() => {
    dispatch(setScreenLoadingStart())
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/products/all`)
      setProducts(res.data.products)
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
  // 取得產品資料

  // 加入購物車
  const addCart = async(id, qty=1 ) => {
    dispatch(setBtnLoadingStart())
    const data = { 
      data : {
        "product_id": id,
        "qty": Number(qty)
      }
    }
    try {
      const res = await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/cart/`, data)
      const {success , message} = res.data
      dispatch(createMessage({
        text: message,
        status: success ? "success" : "failed"
      }))
    } catch (error) {
      const {success , message} = error.response.data
      dispatch(createMessage({
        text: message,
        status: success ? "success" : "failed"
      }))
    } finally {
      dispatch(setBtnLoadingEnd())
    }
  }

  const handleAddCart = async(id) => {
    await addCart(id)
  }
  // 加入購物車

  // 頁面初始化 init
  useEffect(()=>{
    getProducts()
  },[])

  return (
    <>
      <div className="container pt-5">
        <div className="row gy-4">
          {products?.map((product)=>(
            <div key={product.id} className="col-3">
              <div className="card h-100">
                <img className="card-img-top" src={product.imageUrl} alt="Card image cap" style={{height:300}} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{product.title}</h5>
                  <p className="card-text">{product.content}</p>
                  <div className="mt-auto">
                    <p>
                      <del>原價：${product.origin_price}</del>
                      <br />
                      <span className="fw-bold fs-4">特價：${product.price}</span>
                    </p>
                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/products/${product.id}`}
                        className={`btn btn-primary w-100 me-2 ${isBtnLoading && ("disabled")}`}
                      >
                        查看細節
                      </Link>
                      <button
                        className={`btn btn-primary w-100 ${isBtnLoading && ("disabled")} d-flex justify-content-center`}
                        onClick={() => handleAddCart(product.id)}
                      >
                        點我下單
                        {isBtnLoading && (
                          <ReactLoading 
                            className="ms-2"
                            type={"spin"}
                            color={"#000"}
                            height={"1.5rem"}
                            width={"1.5rem"}
                          />)}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
};