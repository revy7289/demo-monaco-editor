import "./App.css";
import { MonacoEditor } from "./components/monacoEditor";

function App() {
  return (
    <>
      <div>
        <div>초기셋팅 테스트</div>
        <div style={{ width: "800px", height: "500px" }}>
          <MonacoEditor />
        </div>
      </div>
    </>
  );
}

export default App;
