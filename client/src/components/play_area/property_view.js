import React, { useState, useEffect } from "react";

import PropertySet from './propertySet'

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

const PropertyView = ({ properties, cardSelection, playerID }) => {
    const set_1 = properties.map((property, index) => {
        property.index = index
        return property
    }).filter((property) => {
        return property.set === 1
    })

    const set_2 = properties.map((property, index) => {
        property.index = index
        return property
    }).filter((property) => {
        return property.set === 2
    })

    const set_3 = properties.map((property, index) => {
        property.index = index
        return property
    }).filter((property) => {
        return property.set === 3
    })

    const set_4 = properties.map((property, index) => {
        property.index = index
        return property
    }).filter((property) => {
        return property.set === 4
    })

    const set_5 = properties.map((property, index) => {
        property.index = index
        return property
    }).filter((property) => {
        return property.set === 5
    })

    const set_6 = properties.map((property, index) => {
        property.index = index
        return property
    }).filter((property) => {
        return property.set === 6
    })

    const set_7 = properties.map((property, index) => {
        property.index = index
        return property
    }).filter((property) => {
        return property.set === 7
    })

    const set_8 = properties.map((property, index) => {
        property.index = index
        return property
    }).filter((property) => {
        return property.set === 8
    })

    const set_9 = properties.map((property, index) => {
        property.index = index
        return property
    }).filter((property) => {
        return property.set === 9
    })

    const set_10 = properties.map((property, index) => {
        property.index = index
        return property
    }).filter((property) => {
        return property.set === 10
    })

    return (
            <div>
                <h4  className='game-card-section-heading'>Properties</h4>
                <PropertySet properties={set_1} setNum={1} setName='Blue' cardSelection={cardSelection} playerID={playerID} propertyImage={CardImgBlue}/>
                <PropertySet properties={set_2} setNum={2} setName='Navy' cardSelection={cardSelection} playerID={playerID} propertyImage={CardImgNavy}/>
                <PropertySet properties={set_3} setNum={3} setName='Purple' cardSelection={cardSelection} playerID={playerID} propertyImage={CardImgPurple}/>
                <PropertySet properties={set_4} setNum={4} setName='Pink' cardSelection={cardSelection} playerID={playerID} propertyImage={CardImgPink}/>
                <PropertySet properties={set_5} setNum={5} setName='Red' cardSelection={cardSelection} playerID={playerID} propertyImage={CardImgRed}/>
                <PropertySet properties={set_6} setNum={6} setName='Orange' cardSelection={cardSelection} playerID={playerID} propertyImage={CardImgOrange}/>
                <PropertySet properties={set_7} setNum={7} setName='Yellow' cardSelection={cardSelection} playerID={playerID} propertyImage={CardImgYellow}/>
                <PropertySet properties={set_8} setNum={8} setName='Lime' cardSelection={cardSelection} playerID={playerID} propertyImage={CardImgLime}/>
                <PropertySet properties={set_9} setNum={9} setName='Green' cardSelection={cardSelection} playerID={playerID} propertyImage={CardImgGreen}/>
                <PropertySet properties={set_10} setNum={10} setName='Cyan' cardSelection={cardSelection} playerID={playerID} propertyImage={CardImgCyan}/>
            </div>
        );
    
};

export default PropertyView;