import { WordleContextProvider } from "../context/context";
import { WordleContainer } from "../features/wordle/wordle.container";
import Layout from "../components/layout/layout";

export default function Home() {
  return (
    <Layout>
      <WordleContextProvider>
        <WordleContainer />
      </WordleContextProvider>
    </Layout>
  );
}
