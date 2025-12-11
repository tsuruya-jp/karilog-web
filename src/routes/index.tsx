import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import FarmLogo from "../assets/logo.png";
import reactLogo from "../assets/react.svg";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://farmfe.org/" target="_blank" rel="noopener">
          <img src={FarmLogo} className="logo" alt="Farm logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="text-red-900">Farm + React</h1>
      <div className="card">
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/routes/index.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Farm and React logos to learn more
      </p>
    </>
  );
}
