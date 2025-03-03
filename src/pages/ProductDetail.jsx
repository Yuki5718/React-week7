import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Link, useParams } from 'react-router-dom';

const { VITE_BASE_URL , VITE_API_PAHT } = import.meta.env

export default function ProductDetail () {
  // 全螢幕Loading
  const [ isScreenLoading , setIsScreenLoading ] = useState(false)
  // 前往購物車
  const [ goToCart , setGoToCart ] = useState(false)

  // 取得路由上的id
  const { id } = useParams()

  // 取得產品資料
  const [ product , setProduct ] = useState([])
  const getProduct = async() => {
    setIsScreenLoading(true)
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/product/${id}`)
      setProduct(res.data.product)
    } catch (error) {
      console.log(error)
      alert("取得產品資料錯誤")
    } finally {
      setIsScreenLoading(false)
    }
  }
  // 取得產品資料

  // 總價(小計)
  const [ totalPrice , setTotalPrice ] = useState(0)

  // 取得下拉選單Ref
  const selectQtyRef = useRef(0)
  //ref.current的初始值，可以是任一類型的值，在首次渲染後會被忽略。
  // 不使用null是因為首次渲染時會報錯，會導致111行 isNaN(selectQtyRef.current.value) 產生錯誤

  // 處理計算總價(小計)
  const handleTotalPriceChange = () => {
    const newTotalPrice = selectQtyRef.current.value * product.price
    setTotalPrice(newTotalPrice)
  }

  // 數量資料初始化
  const qtyInit = () => {
    selectQtyRef.current.value = "---請選擇數量---"
    setTotalPrice(0)
  }

  // 加入購物車
  const addCart = async(id, qty=1 ) => {
    setIsScreenLoading(true)
    const data = { 
      data : {
        "product_id": id,
        "qty": Number(qty)
      }
    }
    try {
      await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/cart`, data)
      setGoToCart(true)
    } catch (error) {
      console.log(error)
      alert("加入購物車失敗")
    } finally {
      setIsScreenLoading(false)
    }
  }

  const handleAddCart = async(id, qty) => {
    await addCart(id, qty)
    qtyInit()
  }

  // 頁面初始化 init
  useEffect(()=>{
    getProduct()
    // setGoToCart(false)
  },[])

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center g-5">
          <div className="col-4">
            <img src={product.imageUrl} className="img-fluid" alt=""  />
          </div>
          <div className="col-4">
            <div className="d-flex flex-column h-100">
              <h5 className="fw-bold d-flex">
                {product.title}
                <small className="ms-1">
                  <span className="badge bg-primary">{product.category}</span>
                </small>
              </h5>
              <p>{product.description}</p>
              <div>
                <del>原價：${product.origin_price}</del>
                <p className="fw-bold">特價：${product.price}</p>
              </div>
              <div className="mb-3">
                <label htmlFor="qtySelect" className="form-label">數量：</label>
                <select id="qtySelect" className="form-select" defaultValue="---請選擇數量---" ref={selectQtyRef}  onChange={handleTotalPriceChange}>
                  <option value="---請選擇數量---" disabled>---請選擇數量---</option>
                  {Array.from({length: 10}).map(( _ , index ) => (
                    <option key={index+1} value={index+1}>{index+1}</option>
                  ))}
                </select>
              </div>
              <div className="d-flex justify-content-between align-items-baseline fw-bold border-top pt-3">
                <p className="mb-0">小計</p>
                <p className="fs-3 mb-0">${totalPrice}</p>
              </div>
              <div className="mt-auto text-end">
                
                
              </div>

              <div className={`d-flex mt-auto ${goToCart ? ("flex-column text-end") : ("flex-row-reverse")}`}>
                <div>
                  <button type="button" 
                    className={`btn btn-primary ${( isScreenLoading || isNaN(selectQtyRef.current.value) ) && ("disabled")}`}
                    onClick={()=>{handleAddCart(product.id , selectQtyRef.current.value)}}
                  > 加入購物車 </button>
                </div>
                <div className={`${goToCart && ("mt-3")}`}>
                  <Link to="/products" className="btn btn-warning me-3">返回產品頁</Link>
                  { goToCart && (<Link to="/cart" className="btn btn-success">前往購物車</Link>) }
                </div>
              </div>
            </div>
          </div>
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
}