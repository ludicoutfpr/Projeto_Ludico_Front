import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { useUser } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { User, Report } from './Tabs';
import { Tabs } from '../../components/Tabs';

const tabs = [
    { label: 'Usuários', id: 'user' },
    { label: 'Relatórios', id: 'report' },
];

export function Admin() {
    const token = localStorage.getItem('authToken');
    const { user } = useUser();

    const [selectedTab, setSelectedTab] = useState("user");
    const [users, setUsers] = useState([]);


    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                setUsers(response.data?.sort((a, b) => a.name > b.name ? 1 : -1));
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.log(err);
            setUsers([]);
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
            {user?.role > 2 &&
                <div className='mx-14 w-full'>
                    {selectedTab === "user" && <User data={users} tabsComponent={tabsComponent} getUsers={getUsers} />}
                    {selectedTab === "report" && <Report tabsComponent={tabsComponent} />}
                </div>
            }
        </div >
    );
}