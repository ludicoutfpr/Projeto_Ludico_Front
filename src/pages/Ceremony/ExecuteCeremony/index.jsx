import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { SubHeader } from '../../../components/Header';
import { Header } from '../../../components/Header';
import axios from "axios";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { CeremonyManaging, GamesList, ParticipantRegister, OneShotsList, ScapeRoomList } from './Tabs';
import { Tabs } from '../../../components/Tabs';

const tabs = [
  { label: 'Gestão do evento', id: 'ceremonyManaging' },
  { label: 'Cadastrar participante', id: 'participantRegister' },
  { label: 'Lista de jogos', id: 'gamesList' },
  { label: 'Lista de oneshots', id: 'oneShotsList' },
  { label: 'Lista de atividades', id: 'activitiesList' },
  { label: 'Escape', id: 'scape' },
];

export function ExecuteCeremony() {
  const routerParams = useParams();
  const token = localStorage.getItem('authToken');

  const [data, setData] = useState(null);
  const [lentData, setLentData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("ceremonyManaging");


  useEffect(() => {
    fetchData();
    fetchLentData();
  }, []);

  const buildObject = (ceremony) => {
    console.log(ceremony)
    const formatedData = {
      ...ceremony,
      eventDate: format(new Date(ceremony.eventDate), 'd \'de\' MMMM \'de\' yyyy', { locale: ptBR }),
    };

    setData(formatedData)
  }

  const fetchData = async () => {
    let response
    try {
      response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony/${routerParams.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log("Erro ao carregar os dados!", error);
    }
    buildObject(response.data)
  };

  const fetchLentData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/lent/unreturned`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setLentData(response.data);
      }
    } catch (error) {
      console.log("Erro ao carregar os dados!", error);
    }
  }

  return (
    <div className="min-h-screen w-screen flex flex-col items-center bg-zinc-700 m-0 p-0">
      <Header />
      {/* <SubHeader navigationItems={navigationItems} /> */}
      <span className='py-6 text-amber-400 text-3xl'>{data?.eventName}</span>
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <div className='mx-14 w-full'>
        {selectedTab === "ceremonyManaging" && <CeremonyManaging data={data} lentData={lentData} fetchLentData={fetchLentData} setSelectedTab={setSelectedTab} />}
        {selectedTab === "participantRegister" && <ParticipantRegister data={data} />}
        {selectedTab === "gamesList" && <GamesList data={data} fetchData={fetchData} />}
        {selectedTab === "oneShotsList" && <OneShotsList data={data} setSelectedTab={setSelectedTab} fetchData={fetchData} />}
        {selectedTab === "scape" && <ScapeRoomList data={data} setSelectedTab={setSelectedTab} fetchData={fetchData} />}
      </div>
    </div >
  );
}