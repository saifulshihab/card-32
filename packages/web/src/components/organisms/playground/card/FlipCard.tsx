import { ICard } from "@card-32/common/types/card";
import React, { PropsWithChildren } from "react";
import styles from "./FlipCard.module.css";

interface IProps {
  card: ICard;
  isFlipCard?: boolean;
}

const FlipCard: React.FC<PropsWithChildren<IProps>> = (props) => {
  const { card, isFlipCard } = props;
  return (
    <div className="w-10 h-16 sm:w-12 sm:h-20 rounded shadow cursor-pointer relative select-none">
      <div
        className={`${styles.flip_card} ${
          isFlipCard ? styles.flip_card_open : ""
        }`}
      >
        <div className={styles.flip_card_inner}>
          <div
            className={`flipped_card bg-white text-black rounded text-4xl ${styles.flip_card_front}`}
          >
            ♠️
          </div>
          <div className={`bg-white rounded ${styles.flip_card_back}`}>
            <p className="text-xl sm:text-2xl font-semibold text-zinc-900">
              {card.value}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FlipCard };
