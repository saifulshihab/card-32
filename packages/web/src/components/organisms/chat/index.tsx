import { MAIN_NAMESPACE_EVENTS } from "@card-32/common/constant/socket/events";
import { IGloabalMessage, IMessage } from "@card-32/common/types/player";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useAuthContext } from "../../../contexts/AuthProvider";
import { generateRandomColor } from "../../../utils/color";

type TGenericMessage =
  | IMessage
  | (IGloabalMessage & {
      username?: string;
    });

interface IProps {
  socket: Socket | undefined;
}

const Chat: React.FC<IProps> = (props) => {
  const { socket } = props;
  const { player } = useAuthContext();

  const scrollDivRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<TGenericMessage[]>([]);

  const scrollIntoChatBottom = () => {
    if (scrollDivRef.current)
      scrollDivRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages) scrollIntoChatBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    // new message
    socket.on(
      MAIN_NAMESPACE_EVENTS.NEW_MESSAGE,
      ({ data }: { data: TGenericMessage }) => {
        setMessages((prev) => [...prev, data]);
      }
    );

    return () => {
      socket.off(MAIN_NAMESPACE_EVENTS.NEW_MESSAGE);
    };
  }, [socket]);

  const sendMessage = (message: string, cb: () => void) => {
    if (!socket) return;
    if (!message) return;
    socket.emit(MAIN_NAMESPACE_EVENTS.SEND_MESSAGE, {
      message,
      username: player?.username,
    });
    cb();
  };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-800">
      <div className="relative py-2 px-3 border-b-4 border-zinc-900">
        <p className="text-2xl font-bold">Chat</p>
      </div>
      {/* messages */}
      <div className="flex flex-grow overflow-hidden">
        <div className="flex h-full flex-col gap-1.5 p-2 pb-0 text-xs overflow-y-scroll scrollbar-hide">
          {messages.map(({ username, message }, idx) => (
            <div key={idx} className="flex gap-1">
              {username ? (
                <>
                  <p>
                    <span
                      style={{
                        color: generateRandomColor(),
                      }}
                      className="font-semibold"
                    >
                      {username}
                    </span>
                  </p>
                  <span className="font-bold">:</span>
                </>
              ) : (
                <span
                  className="font-bold"
                  style={{
                    color: generateRandomColor(),
                  }}
                >
                  :
                </span>
              )}
              <p>{message}</p>
            </div>
          ))}
          <div ref={scrollDivRef} />
        </div>
      </div>
      {/* bottom input */}
      <div>
        <Formik
          initialValues={{
            message: "",
          }}
          onSubmit={(values, { resetForm }) => {
            sendMessage(values.message, () => resetForm());
          }}
        >
          {({ values, handleChange }) => (
            <Form className="h-16 border-t-4 border-zinc-900">
              <div className="flex h-full px-3">
                <input
                  name="message"
                  className="w-full bg-transparent text-sm h-full outline-none"
                  placeholder="Write your message here..."
                  value={values.message}
                  onChange={handleChange}
                />
                <button className="h-full" type="submit">
                  <i className="fa-solid fa-paper-plane" />
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Chat;
