import ReactDOM from 'react-dom'
import './Modal.css'

const Modal = ({text, open, onClose, children}: any) => {
  if (!open) return null

  return ReactDOM.createPortal(
    <>
      <div className='popup'>
        <div className='popup-inner'>
          <h3>{text}</h3>
          <button className='close-btn' onClick={onClose}>Close</button>
          {children}
        </div>
      </div>
    </>, 
    document.getElementById("modalPortal")!
  )
}

export default Modal