import { useSelector } from 'react-redux';

export default function Home() {
  const userInfo = useSelector((state) => state.userInfo)
  // 全螢幕Loading
  const isScreenLoading = useSelector((state) => state.loading.ScreenLoading.isLoading)

  return (
    <>
      <div className="container py-5">
        {isScreenLoading ? (<></>) : (
          <>
            {userInfo.isAuth ? (<h1>歡迎登入，這裡是首頁～</h1>) : (<h1>Hello，這裡是首頁～</h1>)}
          </>
        )}
      </div>
    </>
  )
};
