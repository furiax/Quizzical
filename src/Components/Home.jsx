export default function Home(props) {
  return (
    <div className="home-screen">
      <h1>Quizzical</h1>
      <p>Test your knowledge</p>
      <button onClick={props.startGame}>Start quiz</button>
    </div>
  );
}
