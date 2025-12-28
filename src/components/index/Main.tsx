"use client";

import { useState } from "react";
import Login from "./Login";
import IndexMain from "./IndexMain";

const Main = () => {
  const [content, setContent] = useState("login");

  return (
    <main className="flex flex-col items-center w-[95%] max-w-[800px] mx-auto gap-3 pt-[80px] md:pt-[50px]">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-2xl text-primary">TNCJ</h1>
        <p className="text-default-500">Technology</p>
      </div>
      {content === "login" && (
        <Login callbackContent={(content) => setContent(content)} />
      )}
      {content === "main" && <IndexMain />}
    </main>
  );
};

export default Main;
