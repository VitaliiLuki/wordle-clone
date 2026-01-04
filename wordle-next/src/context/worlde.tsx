import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
} from "react";

const WORDS_LIST_URL =
  "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words";

const fetchWords = async (
  controller: AbortController,
  setter: Dispatch<SetStateAction<string[]>>
) => {
  try {
    const res = await fetch(WORDS_LIST_URL, { signal: controller.signal });

    if (!res.ok) throw new Error(`Failed to fetch words: ${res.status}`);

    const text = await res.text();
    const list = text
      .split("\n")
      .map((w) => w.trim())
      .filter(Boolean);

    setter(list);
  } catch (e) {
    if ((e as Error).name !== "AbortError") {
      console.error("Word list fetch error:", e);
    }
  }
};

type WordleContextType = { words: string[] };
export const WordleContext = createContext<WordleContextType>({ words: [] });

type WordleContextProviderProps = { children: ReactNode };

export const WordleContextProvider: FC<WordleContextProviderProps> = ({
  children,
}) => {
  const [words, setWords] = useState<Array<string>>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetchWords(controller, setWords);

    return () => controller.abort();
  }, []);

  return (
    <WordleContext.Provider value={{ words }}>
      {children}
    </WordleContext.Provider>
  );
};
