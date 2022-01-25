import React from "react";

import CardImgDrawMore from "../../assets/Cards/Cards_Action/Draw_more-1.svg";
import CardImgLottery from "../../assets/Cards/Cards_Action/Lottery-1.svg";
import CardImgNein from "../../assets/Cards/Cards_Action/Nein-1.svg";
import CardImgSlyDeal from "../../assets/Cards/Cards_Action/Sly_deal-1 .svg";
import CardImgStartFresh from "../../assets/Cards/Cards_Action/Start Fresh.svg";
import CardImgFBIRaid from "../../assets/Cards/Cards_Action/FBI Raid.svg";

const HandViewer = ({ hand, turnStatus, playCard }) => {
  const card_img_default_style = "card-img-wrapper";
  const card_img_active_style = "card-img-wrapper card-img-active-wrapper";

  const DrawMoreCard = (
    <img
      src={CardImgDrawMore}
      className={turnStatus ? card_img_active_style : card_img_default_style}
    />
  );
  const LotteryCard = (
    <img
      src={CardImgLottery}
      className={turnStatus ? card_img_active_style : card_img_default_style}
    />
  );
  const NeinCard = (
    <img
      src={CardImgNein}
      className={turnStatus ? card_img_active_style : card_img_default_style}
    />
  );
  const SlyDealCard = (
    <img
      src={CardImgSlyDeal}
      className={turnStatus ? card_img_active_style : card_img_default_style}
    />
  );
  const StartFreshCard = (
    <img
      src={CardImgStartFresh}
      className={turnStatus ? card_img_active_style : card_img_default_style}
    />
  );
  const FBIRaidCard = (
    <img
      src={CardImgFBIRaid}
      className={turnStatus ? card_img_active_style : card_img_default_style}
    />
  );

  return (
    <div>
      <h3 className="overall-game-card-heading">Your Hand ({hand.length})</h3>

      <div className="cash-section">
        {hand.map((card, i) => (
          <div key={i} className="card-wrapper cash-card-wrapper">
            {card.action === 1 && DrawMoreCard}
            {card.action === 2 && LotteryCard}
            {card.action === 3 && NeinCard}
            {card.action === 4 && SlyDealCard}
            {card.action === 5 && StartFreshCard}
            {card.action === 6 && FBIRaidCard}

            <div className="card-play-options">
              <div>{card.cash_value} M </div>
              {turnStatus && card.type === "action" ? (
                <button
                  className="card-play-option-button"
                  onClick={(e) => playCard(i, true)}
                >
                  {" "}
                  Cash
                </button>
              ) : null}
              {turnStatus ? (
                <button
                  className="card-play-option-button"
                  onClick={(e) => playCard(i, false)}
                >
                  {" "}
                  Play
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HandViewer;
