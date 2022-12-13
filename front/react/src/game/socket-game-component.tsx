import { PropsWithChildren, useEffect, useReducer } from 'react';
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from '../context/socket.context';
import { useSocket } from '../context/use-socket';

export interface ISocketGameContextComponentProps extends PropsWithChildren {}

const SocketGameContextComponent: React.FunctionComponent<
  ISocketGameContextComponentProps
> = (props) => {
  const { children } = props;
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState,
  );

  const socket = useSocket('http://localhost:3333/game', {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
    auth: {
      token: sessionStorage.getItem('Token'),
    },
  });

  useEffect(() => {
    /** connect to the web socket */
    console.log('SOCKET CONNECT');
    socket.connect();
    /** save socket in context */
    SocketDispatch({ type: 'update_socket', payload: socket });
  }, [socket]);

  useEffect(() => {
    /** start the event listeners */
    socket.removeAllListeners();
    const StartListener = () => {
      /**disconnect */
      socket.on('Disconnect', () => {
        console.log('disconnect');
        socket.disconnect();
      });
      /**handshake */
      socket.on('handshake', (id: string) => {
        console.log('user id is: ', id);
      });
      /** receive new id */
      socket.on('new_user', (uid: string) => {
        console.log('User connected, new user receive', uid, 'last uid');
        SocketDispatch({ type: 'update_uid', payload: uid });
      });
      /** reconnect event*/
      socket.io.on('reconnect', (attempt) => {
        console.log('reconnect on attempt: ' + attempt);
      });

      /**reconnect attempt event */
      socket.io.on('reconnect_attempt', (attempt) => {
        console.log('reconnect on attempt: ' + attempt);
      });

      /**Reconnection error */
      socket.io.on('reconnect_error', (error) => {
        console.log('reconnect error: ' + error);
      });

      /**Reconnection failed */
      socket.io.on('reconnect_failed', () => {
        console.log('reconnection failed ');
        alert('we are unable to reconnect you to the web socket');
      });
    };
    StartListener();
  }, [socket]);

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketGameContextComponent;
