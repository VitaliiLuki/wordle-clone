import { WordleContext } from "@/src/context/context";
import { FC, useContext } from "react";
import { WordleBoard } from "./components/wordle-board/wordle-board.component";
import styles from "./wordle.module.scss";

export const WordleContainer: FC = () => {
  const ctx = useContext(WordleContext);

  const { userChoices, focusCell, writeUserChoice, changeFocus } = ctx;

  return (
    <>
      <header>Wordle Game</header>
      <main className={styles.mainSection}>
        <WordleBoard
          userChoices={userChoices}
          focusCell={focusCell}
          choiceSetter={writeUserChoice}
          changeFocus={changeFocus}
        />
      </main>
      <footer>General Info...</footer>
    </>
  );
};
