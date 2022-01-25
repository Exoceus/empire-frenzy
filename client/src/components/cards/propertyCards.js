import React from 'react'

import CardImgBlue from '../../assets/Cards/Cards_Property/Blue/Blue-1.svg'
import CardImgCyan from '../../assets/Cards/Cards_Property/Cyan/Cyan-1.svg'
import CardImgGreen from '../../assets/Cards/Cards_Property/Green/Green-1.svg'
import CardImgLime from '../../assets/Cards/Cards_Property/Lime/Lime-1.svg'
import CardImgNavy from '../../assets/Cards/Cards_Property/Navy/Navy-1.svg'
import CardImgOrange from '../../assets/Cards/Cards_Property/Orange/Orange-1.svg'
import CardImgPink from '../../assets/Cards/Cards_Property/Pink/Pink-1.svg'
import CardImgPurple from '../../assets/Cards/Cards_Property/Purple/Purple-1.svg'
import CardImgRed from '../../assets/Cards/Cards_Property/Red/Red-1.svg'
import CardImgYellow from '../../assets/Cards/Cards_Property/Yellow/Yellow-1.svg'

export default function PropertyCard({card}) {

    if(card){
        if(card.set === 1){
            var property_img = CardImgBlue
        } else if(card.set === 2){
            var property_img = CardImgNavy
        } else if(card.set === 3){
            var property_img = CardImgPurple
        } else if(card.set === 4){
            var property_img = CardImgPink
        } else if(card.set === 5){
            var property_img = CardImgRed
        } else if(card.set === 6){
            var property_img = CardImgOrange
        } else if(card.set === 7){
            var property_img = CardImgYellow
        } else if(card.set === 8){
            var property_img = CardImgLime
        } else if(card.set === 9){
            var property_img = CardImgGreen
        } else if(card.set === 10){
            var property_img = CardImgCyan
        }
    }
    

    return (
        <div className='card-wrapper property-card-wrapper'>
                        
                        <img src={property_img} className='card-img-wrapper'/>

                        <div className='card-play-options'>
                            <div>{(card) ? card.cash_value : ""} M </div> 
                           
                        </div>
        </div>
    )
}
