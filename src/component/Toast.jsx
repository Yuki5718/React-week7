import { useSelector } from "react-redux"

export default function Toast () {

  const messages = useSelector((state) => state.toast.messages)
  console.log(messages);
  

  return (
    <>
      {messages.map((message)=>(
        <div key={message.id} className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1000 }}>
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className={`toast-header ${message.status === "success" ? "bg-success" : "bg-danger"} text-white`}>
              <strong className="me-auto">{message.status === "success" ? "成功" : "失敗"}</strong>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">{message.text}</div>
          </div>
        </div>
      ))}      
    </>
  )
}