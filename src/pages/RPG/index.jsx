import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { useUser } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Campaign, RpgSystem, Character } from './Tabs';
import { Tabs } from '../../components/Tabs';

const tabs = [
    { label: 'Campanhas', id: 'campaign' },
    { label: 'Sistemas', id: 'rpgSystem' },
    { label: 'Personagens', id: 'character' },
];

export function RPG() {
    const token = localStorage.getItem('authToken');
    const { user } = useUser();

    const [selectedTab, setSelectedTab] = useState("campaign");
    const [campaigns, setCampaigns] = useState([]);
    const [rpgSystems, setRpgSystems] = useState([]);
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        getCampaigns();
        getRpgSystems();
        getCharacters();
    }, []);

    const getCampaigns = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/campaing`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                setCampaigns(response.data);
            } else {
                setCampaigns([]);
            }
        } catch (err) {
            console.log(err);
            setCampaigns([]);
        }
    }

    const getRpgSystems = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/rpgSystem`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                setRpgSystems(response.data);
            } else {
                setRpgSystems([]);
            }
        } catch (err) {
            console.log(err);
            setRpgSystems([]);
        }
    }

    const getCharacters = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/character`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                setCharacters(response.data);
            } else {
                setCharacters([]);
            }
        } catch (err) {
            console.log(err);
            setCharacters([]);
        }
    }

    const tabsComponent = <div className='flex items-start w-full mt-16 mb-4'>
        <Tabs
            tabs={tabs}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
        />
    </div>

    return (
        <div className="min-h-screen w-screen flex flex-col items-center bg-zinc-700 m-0 p-0">
            <Header />
            <div className='mx-14 w-full'>
                {selectedTab === "campaign" && <Campaign data={campaigns} tabsComponent={tabsComponent} getCampaigns={getCampaigns} rpgSystems={rpgSystems} />}
                {selectedTab === "rpgSystem" && <RpgSystem data={rpgSystems} tabsComponent={tabsComponent} getRpgSystems={getRpgSystems} />}
                {selectedTab === "character" && <Character data={characters} tabsComponent={tabsComponent} getCharacters={getCharacters} campaigns={campaigns} getCampaigns={getCampaigns} />}
            </div>
        </div >
    );
}