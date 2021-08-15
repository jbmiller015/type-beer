import React, {useEffect, useState} from 'react';
import Tank from "./Tank";
import typeApi from '../api/type-server'

const BrewFloor = () => {

    const [tanks, setTanks] = useState([]);

    useEffect(() => {
        const getTanks = async () => {
            const {data} = await typeApi.get('/tanks')
            setTanks(data)
        }
        getTanks();
    }, [tanks]);

    const renderTanks = tanks.map(tank => {
        return (<Tank>{tank}</Tank>)
    })

    return (<div>{renderTanks}</div>);
};

export default BrewFloor;
