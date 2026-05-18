import React from "react";
import { TopBar } from "./ui.jsx";
import { StartScreen } from "./screens/StartScreen.jsx";
import { QuizScreen } from "./screens/QuizScreen.jsx";
import { DictScreen } from "./screens/DictScreen.jsx";

// ============================================================
// APP ROOT
// ============================================================
const App = () => {
  const [route, setRoute] = React.useState("start");
  const home = () => setRoute("start");
  return (
    <div>
      <TopBar route={route} onHome={home} />
      {route === "start" && <StartScreen onStart={() => setRoute("quiz")} onDict={() => setRoute("dict")} />}
      {route === "quiz" && <QuizScreen onHome={home} />}
      {route === "dict" && <DictScreen />}
      <Footer />
    </div>);

};

const Footer = () =>
<footer style={{
  borderTop: "1px solid var(--line)",
  padding: "24px 56px",
  display: "flex", justifyContent: "space-between", alignItems: "center",
  background: "#fff"
}}>
    <div className="mono" style={{ fontSize: 11, letterSpacing: ".2em", color: "var(--ink-3)" }}>
      © MARKDOWN QUIZ · v2.0
    </div>
  </footer>;

export default App;
