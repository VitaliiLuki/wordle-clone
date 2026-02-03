import { WordleContextProvider } from "../context/context";
import { WordleContainer } from "../features/wordle/wordle.container";
import Layout from "../components/layout/layout";
import { ViewModelContextProvider } from "../utils/context/view-model.context";
import { WorldeViewModel } from "../features/wordle/view-model/worlde.view-model";

export default function Home() {
	return (
		<Layout>
			<ViewModelContextProvider vm={WorldeViewModel}>
				<WordleContainer />
			</ViewModelContextProvider>
		</Layout>
	);
}
