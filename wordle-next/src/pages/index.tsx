import { FC, useContext } from "react";
import { WordleContext, WordleContextProvider } from "../context/worlde";
import App from "./_app";

const WordleContainer: FC = () => {
  const ctx = useContext(WordleContext);

  return (
    <main>
      {ctx.words.slice(0, 10).map((word, idx) => (
        <div key={idx}>{word}</div>
      ))}
    </main>
  );
};
export default function Home() {
  return (
    <WordleContextProvider>
      <div>
        <WordleContainer />
      </div>
    </WordleContextProvider>
  );
}
