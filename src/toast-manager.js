import React from "react";
// import { CSSTransition } from "react-transition-group";
import styled, { keyframes } from "styled-components";

const Ctx = React.createContext();

const KeyframeToast = keyframes`
  from {
    transform: translateY(100%);
    /* padding: 0px; */
  }

  to {
     /* padding: unset;  */
    transform: translateY(0);
  }
`;

const StyledToastContainer = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 720px;
  overflow: hidden;
  transition: all 3s linear;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
`;

const StyledToast = styled.div`
  background: rgba(190, 38, 38, 0.9);
  border-radius: 2px;
  font-size: 11px;
  color: #fff;
  font-family: Roboto;
  margin-top: 10px;
  padding: 14px;
  transition: all 0.3s ease-in-out;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${KeyframeToast} .2s ease-in-out;

  &:hover {
    background: rgba(190, 38, 38, 1);
  }

  button {
    font-size: 11px;
    font-weight: 500;
    background: transparent;
    border: rgba(190, 38, 38, 0.7);
    padding: 10px;
    color: #fff;
    cursor: pointer;

    &:hover {
      background: #dd3737;
    }
  }
`;

const ToastContainer = props => <StyledToastContainer {...props} />;

const Toast = ({ children, onDismiss }) => (
  <StyledToast>
    <div>{children}</div>
    <button onClick={onDismiss}>DISMISS</button>
  </StyledToast>
);

// Provider
// ==============================

let toastCount = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const add = content => {
    const id = toastCount++;
    const toast = { content, id };
    setToasts([...toasts, toast]);
  };
  const remove = id => {
    const newToasts = toasts.filter(t => t.id !== id);
    setToasts(newToasts);
  };
  // avoid creating a new fn on every render
  const onDismiss = id => () => remove(id);

  return (
    <Ctx.Provider value={{ add, remove }}>
      {children}
      <ToastContainer>
        {toasts.map(({ content, id, ...rest }) => (
          <Toast key={id} Toast={Toast} onDismiss={onDismiss(id)} {...rest}>
            alert {id} {content}
          </Toast>
        ))}
      </ToastContainer>
    </Ctx.Provider>
  );
}

// Consumer
// ==============================

export const useToasts = () => React.useContext(Ctx);
