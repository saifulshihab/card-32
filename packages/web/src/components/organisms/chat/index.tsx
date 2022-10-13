import { TGenericMessage } from "@card-32/common/types/player";
import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

interface IProps {
  isGlobal?: boolean;
  messages: TGenericMessage[];
  handleSendMessage: (message: string, callback?: () => void) => void;
}

const Chat: React.FC<IProps> = (props) => {
  const { isGlobal, messages, handleSendMessage } = props;
  const scrollDivRef = useRef<HTMLDivElement | null>(null);

  const scrollIntoChatBottom = () => {
    if (scrollDivRef.current)
      scrollDivRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages) scrollIntoChatBottom();
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col bg-zinc-800">
      <div className="relative py-2 px-3 border-b-4 border-zinc-900">
        <p className="text-2xl font-bold">
          {isGlobal ? "🌐 Global Chat" : "Chat"}
        </p>
      </div>
      {/* messages */}
      <div className="flex flex-grow overflow-hidden">
        <div className="flex h-full flex-col gap-0.5 p-2 pb-0 text-sm overflow-y-scroll scrollbar-hide">
          {messages.map((message, idx) => (
            <ChatMessage key={idx} message={message} />
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
            handleSendMessage(values.message, () => resetForm());
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
