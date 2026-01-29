import { useState } from "react";
import Home from "./Components/Home";
import Questions from "./Components/Questions";

function App() {
  const [gameStarted, setGameStart] = useState(false);

  function startGame() {
    setGameStart(true);
  }

  return (
    <>
      <main>
        {gameStarted ? <Questions /> : <Home startGame={startGame} />}
      </main>
    </>
  );
}

export default App;
