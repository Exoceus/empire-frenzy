import React from 'react';

import CardImgDrawMore from '../../assets/Cards/Cards_Action/Draw_more-1.svg'
import CardImgLottery from '../../assets/Cards/Cards_Action/Lottery-1.svg'
import CardImgNein from '../../assets/Cards/Cards_Action/Nein-1.svg'
import CardImgSlyDeal from '../../assets/Cards/Cards_Action/Sly_deal-1 .svg'

const HandViewer = ({ hand, turnStatus, playCard }) => {


    const DrawMoreCard = <img src={CardImgDrawMore} className='card-img-wrapper'/>
    const LotteryCard = <img src={CardImgLottery} className='card-img-wrapper'/>
    const NeinCard = <img src={CardImgNein} className='card-img-wrapper'/>
    const SlyDealCard = <img src={CardImgSlyDeal} className='card-img-wrapper'/>

    return (
        <div>
            <h3 className='overall-game-card-heading'>Your Hand ({hand.length})</h3>

            <div className='cash-section'>
            {hand.map((card, i) => 

            <div key={i} className='card-wrapper cash-card-wrapper'>

                { card.action === 1 && DrawMoreCard}
                { card.action === 2 && LotteryCard}
                { card.action === 3 && NeinCard}
                { card.action === 4 && SlyDealCard}

                <div className='card-play-options'> 
                    <div>{card.cash_value} M </div>
                    {(turnStatus) ? <button className='card-play-option-button' onClick={e => playCard(i)}> Play</button> : null}
                </div>
            </div>
            )}
            </div>
        </div>
    );
};

export default HandViewer;