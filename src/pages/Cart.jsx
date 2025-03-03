import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import OrderForm from '../component/OrderForm';

const { VITE_BASE_URL , VITE_API_PAHT } = import.meta.env

export default function Cart () {
  // 購物車Loading
  const [ isCartLoading , setIsCartLoading ] = useState(false)

  // 取得購物車資料
  const [ cartData , setCartData ] = useState([])
  const getCartData = async() => {
    setIsCartLoading(true)
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/cart`)
      const data = res.data.data
      setCartData(data)
    } catch (error) {
      console.log(error)
      alert("購物車資料取得失敗")
    } finally {
      setIsCartLoading(false)
    }
  }
  // 取得購物車資料

  // 變更數量
  const changeQty = async(clickType, itemId , qty) => {
    let newQty = qty
    switch (clickType) {
      case "plusQty":
        newQty = qty + 1
        break;

      case "minusQty":
        newQty = qty - 1
        break;
    
      default:
        break;
    }

    const data = {
      "data": {
        "product_id": itemId,
        "qty": newQty
      }
    }

    try {
      await axios.put(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/cart/${itemId}`, data)
    } catch (error) {
      console.log(error)
      alert("數量變更失敗")
    }
  }
  
  // 刪除購物車(單一)
  const deleteCartItem = async(itemId) => {
    try {
      await axios.delete(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/cart/${itemId}`)
    } catch (error) {
      console.log(error)
      alert("刪除購物車失敗")
    }
  }

  // 刪除購物車(全部)
  const deleteCartAll = async() => {
    try {
      await axios.delete(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/carts`)
    } catch (error) {
      console.log(error)
      alert("刪除購物車失敗")
    }
  }

  // 處理購物車更新
  const handleUpdateCart = async(e , clickType , id , qty) => {
    e.preventDefault()

    switch (clickType) {
      case "deleteItem":
        await deleteCartItem(id)
        break;

      case "deleteAll":
        await deleteCartAll()
        break;

      case "plusQty":
      case "minusQty":
        await changeQty(clickType , id , qty)
        break;
    
      default:
        break;
    }

    getCartData()
  }

  // 頁面初始化 init
  useEffect(()=>{
    getCartData()
  },[])

  return (
    <div className="container pt-5">
      {isCartLoading && (<div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(255,255,255,0.3)",
          zIndex: 999,
        }}
      >
        <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
      </div>)}

      <h3 className="text-center fw-bold mb-5">購物車</h3>

      <div className="row row-cols-1 justify-content-center">
        <div className="col-8 mb-5">
          {( cartData?.carts?.length > 0 ) ? (
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col">產品圖片</th>
                  <th scope="col">產品名稱</th>
                  <th scope="col">單價</th>
                  <th scope="col" className="text-center">數量</th>
                  <th scope="col" className="text-end">小計</th>
                  <th className="text-end" style={{width:130}}>{(cartData?.carts?.length > 1) && (<button type="button" className={`btn btn-warning ${isCartLoading && ("disabled")}`} onClick={(e)=>handleUpdateCart(e , "deleteAll")}>全部刪除</button>)}</th>
                </tr>
              </thead>
              <tbody>
                {cartData.carts.map(({id,qty,total,product})=>(
                  <tr key={id}>
                    <td>
                      <img src={product.imageUrl} className="img-fluid" style={{height:100}} alt={product.title} />
                    </td>
                    <th>{product.title}</th>
                    <td>${product.price}</td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <button className={`btn btn-secondary py-0 px-1 ${(isCartLoading || (qty === 1)) && ("disabled")}`} onClick={(e)=>handleUpdateCart(e , "minusQty" , id , qty)}><i className="bi bi-dash" /></button>
                          {qty}
                        <button className={`btn btn-secondary py-0 px-1 ${isCartLoading && ("disabled")}`} onClick={(e)=>handleUpdateCart(e , "plusQty" , id , qty)}><i className="bi bi-plus" /></button>
                      </div>
                    </td>
                    <td className="text-end">${total}</td>
                    <td className="text-end">
                      <button type="button" className={`btn btn-danger ${isCartLoading && ("disabled")}`} onClick={(e)=>handleUpdateCart(e , "deleteItem" , id)} >刪除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="fs-3">
                <tr>
                  <th scope="row" colspan="4" className="text-end">總計</th>
                  <td className="text-end fw-bold">${cartData.total}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            ) : (
            <p className="text-center text-primary fs-1 fw-bold py-5 mb-0">Oops！購物車裡沒有東西～</p>
          )}
        </div>
        
        <div className="col-8">
          <h3 className="text-center fw-bold mb-5">訂購資料</h3>
          <OrderForm 
            cartData={cartData}
            getCartData={getCartData}
            isCartLoading={isCartLoading}
          />
        </div>
      </div>
    </div>
  )
}