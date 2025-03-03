import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';
import axios from 'axios';

const { VITE_BASE_URL , VITE_API_PAHT } = import.meta.env

function OrderForm({
  cartData,
  getCartData,
  isCartLoading
}) {
  // 表單按鈕Loading效果
  const [ formBtnLoading , setFormBtnLoading ] = useState(false)

  // oderId狀態
  const [ oderId , setOderId ] = useState(null)

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name:"",
      email:"",
      tel:"",
      address:"",
      message:""
    },
    mode: "onTouched"
  })

  const defaultOderData = {
    "data": {
      "user": {
        "name": "test",
        "email": "test@gmail.com",
        "tel": "0912346768",
        "address": "kaohsiung"
      },
      "message": "這是留言"
    }
  }

  const onSubmit = ({name, tel, email, address, message}) => {
    const oderData = {
      ...defaultOderData,
      "data": {
        "user": {
          name,
          email,
          tel,
          address
        },
        message
      }
    }
    handleOder(oderData)
  }

  const handleOder = async(data) => {
    setFormBtnLoading(true)
    try {
      const res = await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/order`, data)
      setOderId(res.data.orderId)
      getCartData()
      reset()
    } catch (error) {
      console.log(error)
      alert("訂單送出失敗")
    } finally {
      setFormBtnLoading(false)
    }
  }

  const handlePay = async(oderId) => {
    setFormBtnLoading(true)
    try {
      const res = await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PAHT}/pay/${oderId}`)
      setOderId(null)
    } catch (error) {
      console.log(error)
      alert("付款失敗")
    } finally {
      setFormBtnLoading(false)
    }
  }

  return (<>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="name" className="form-label">購買人</label>
          <input type="text" id="name" className={`form-control ${errors.name && "is-invalid"}`} 
            {...register("name", {
              required: {
                value: true,
                message: "*必填欄位"
              }
            })}
            disabled={cartData?.carts?.length < 1}
          />
          {errors.name && (<div className="invalid-feedback">{errors?.name?.message}</div>)}
        </div>
        <div className="col-6">
          <label htmlFor="tel" className="form-label">連絡電話</label>
          <input type="tel" id="tel" className={`form-control ${errors.tel && "is-invalid"}`} 
            {...register("tel", {
              required: {
                value: true,
                message: "*必填欄位"
              },
              pattern: {
                value: /^(0[2-8]\d{7}|09\d{8})$/,
                message: "電話格式錯誤，請輸入有效的台灣電話號碼"
              }
            })}
            disabled={cartData?.carts?.length < 1}
          />
          {errors.tel && (<div className="invalid-feedback">{errors?.tel?.message}</div>)}
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input type="email" id="email" className={`form-control ${errors.email && "is-invalid"}`} 
          {...register("email", {
            required: {
              value: true,
              message: "*必填欄位"
            },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Email 格式錯誤"
            }
          })} 
          disabled={cartData?.carts?.length < 1}
        />
        {errors.email && (<div className="invalid-feedback">{errors?.email?.message}</div>)}
      </div>
      <div className="mb-3">
        <label htmlFor="address" className="form-label">地址</label>
        <input type="text" id="address" className={`form-control ${errors.address && "is-invalid"}`} 
          {...register("address", {
            required: {
              value: true,
              message: "*必填欄位"
            }
          })}
          disabled={cartData?.carts?.length < 1}
        />
        {errors.address && (<div className="invalid-feedback">{errors?.address?.message}</div>)}
      </div>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">留言</label>
        <textarea name="message" id="message" className="form-control" rows={3} {...register("message")} disabled={cartData?.carts?.length < 1} />
      </div>
      <div className="d-flex justify-content-center">
        <button type="submit" className={`btn btn-primary d-flex align-items-center gap-2 ${(isCartLoading || (cartData?.carts?.length < 1) ) && ("disabled")}`} >送出訂單
          {(formBtnLoading && (oderId === null)) && (<ReactLoading
            type={"spin"}
            color={"#000"}
            height={"1.5rem"}
            width={"1.5rem"}
          />)}
        </button>
      </div>
    </form>
    <div className="d-flex justify-content-center mt-3">
      <button type="button" className={`btn btn-success d-flex align-items-center gap-2 ${(isCartLoading || (oderId === null)) && ("disabled")}`} onClick={()=>handlePay(oderId)}>點擊付款
        {(formBtnLoading && (oderId !== null)) && (<ReactLoading
          type={"spin"}
          color={"#000"}
          height={"1.5rem"}
          width={"1.5rem"}
        />)}
      </button>
    </div>
  </>)
}

export default OrderForm;