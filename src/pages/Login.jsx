import { useEffect , useState } from "react"
import { useForm } from "react-hook-form"
import ReactLoading from 'react-loading';
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useDispatch , useSelector } from 'react-redux';
import { createMessage } from '../redux/toastSlice';
import { createUserInfo } from '../redux/userInfoSlice';

const { VITE_BASE_URL } = import.meta.env

export default function Login() {
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.userInfo)

  // 全螢幕Loading
  const [ isScreenLoading , setIsScreenLoading ] = useState(false)

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode: "onTouched"
  })
  
  const onSubmit = async(data) => {
    setIsScreenLoading(true)
    try {
      const res = await axios.post(`${VITE_BASE_URL}/admin/signin`,data)
      const { token , expired , uid } = res.data
      // 寫入cookie
      document.cookie = `hexToken=${token}; expired=${new Date(expired)};`
      dispatch(createUserInfo({
        isAuth: true,
        token,
        uid
      }))
    } catch (error) {
      const {success , message} = error.response.data
      dispatch(createMessage({
        text: message,
        status: success ? "success" : "failed"
      }))
    } finally {
      setIsScreenLoading(false)
    }
  }

  // 登入後重新導向首頁
  const navigate = useNavigate()
  useEffect(() => {
    if (userInfo.isAuth) {
      setTimeout(() => {
        navigate(`/user/${userInfo.uid}`)
      }, 3000);
    }
  },[userInfo])
  
  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          {userInfo.isAuth ? (
            <div className="col-4">
              <h1 className="text-center mb-3">登入成功</h1>
              <h1 className="text-center">3秒後回到首頁</h1>
            </div>
          ) : (
            <div className="col-4">
              <h1 className="text-center">登入</h1>
              <form className="mt-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-floating mb-3">
                  <input type="email" id="username" placeholder="請輸入Email"
                    className={`form-control ${errors.username && ("is-invalid")}`}
                    {...register("username", {
                      required: {
                        value:true,
                        message: "*必填欄位"
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Email格式錯誤"
                      }
                    })}
                  />
                  <label htmlFor="username">請輸入Email</label>
                  {errors.username && (<div className="invalid-feedback">{errors?.username?.message}</div>)}
                </div>
                <div className="form-floating mb-3">
                  <input type="password" id="password" placeholder="請輸入密碼"
                    className={`form-control ${errors.password && ("is-invalid")}`}
                    {...register("password", {
                      required: {
                        value:true,
                        message: "*必填欄位"
                      },
                      minLength: {
                        value: 6,
                        message: "密碼不得少於6碼"
                      },
                      maxLength: {
                        value: 16,
                        message: "密碼不得多於16碼"
                      }
                    })}
                  />
                  <label htmlFor="password">請輸入密碼</label>
                  {errors.password && (<div className="invalid-feedback">{errors?.password?.message}</div>)}
                </div>
                <button type="submit" className="btn btn-primary w-100">登入</button>
              </form>
            </div>
          )}
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