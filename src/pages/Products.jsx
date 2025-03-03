import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Link } from 'react-router-dom';

const { VITE_BASE_URL , VITE_API_PAHT } = import.meta.env

export default function Products () {
  // 全螢幕Loading
  const [ isScreenLoading , setIsScreenLoading ] = useState(false)
  // 按鈕顯示Loading
  const [ isCartLoading , setIsCartLoading ] = useState(false)

  // 取得產品資料
  const [ products , setProducts ] = useState([])
  const getProducts = async() => {
    setIsScreenLoading(true)
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/products/all`)
      setProducts(res.data.products)
    } catch (error) {
      console.log(error)
      alert("取得產品資料失敗")
    } finally {
      setIsScreenLoading(false)
    }
  }
  // 取得產品資料

  // 加入購物車
  const addCart = async(id, qty=1 ) => {
    setIsCartLoading(true)
    const data = { 
      data : {
        "product_id": id,
        "qty": Number(qty)
      }
    }
    try {
      await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/cart`, data)
    } catch (error) {
      console.log(error)
      alert("加入購物車失敗")
    } finally {
      setIsCartLoading(false)
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
        {products.map((product)=>(
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
                      className={`btn btn-primary w-100 me-2 ${isCartLoading && ("disabled")}`}
                    >
                      查看細節
                    </Link>
                    <button
                      className={`btn btn-primary w-100 ${isCartLoading && ("disabled")} d-flex justify-content-center`}
                      onClick={() => handleAddCart(product.id)}
                    >
                      點我下單
                      {isCartLoading && (
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

    { isScreenLoading && (<div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255,255,255,0.3)",
        zIndex: 999,
      }}
    >
      <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
    </div>)}
    </>
  )
};