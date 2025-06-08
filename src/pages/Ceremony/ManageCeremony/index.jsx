import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router";
import { Header } from "../../../components/Header"
import { PrimaryButton } from "../../../components/Button";
import { LabeledInput } from "../../../components/Input";
import axios from "axios";

export function ManageCeremony() {
  const navigate = useNavigate();
  const routerParams = useParams();
  const [eventName, setEventName] = useState();
  const [eventCity, setEventCity] = useState();
  const [eventPlace, setEventPlace] = useState();
  const [eventDate, setEventDate] = useState();
  const [eventStartTime, setEventStartTime] = useState();
  const [eventEndTime, setEventEndTime] = useState();

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (routerParams.id) {
      fetchData();
    }
  }, []);

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

  const buildObject = (ceremony) => {
    setEventName(ceremony.eventName);
    setEventCity(ceremony.eventCity);
    setEventPlace(ceremony.eventPlace);
    setEventDate(ceremony.eventDate?.split("T")?.[0]);
    setEventStartTime(ceremony.eventStartTime);
    setEventEndTime(ceremony.eventEndTime);
  }


  const changeEventName = (e) => {
    const value = e.target.value;
    setEventName(value);
  }

  const changeEventCity = (e) => {
    const value = e.target.value;
    setEventCity(value);
  }

  const changeEventPlace = (e) => {
    const value = e.target.value;
    setEventPlace(value);
  }

  const changeEventDate = (e) => {
    const value = e.target.value;
    setEventDate(value);
  }

  const changeEventStartTime = (e) => {
    const value = e.target.value;
    setEventStartTime(value);
  }

  const changeEventEndTime = (e) => {
    const value = e.target.value;
    setEventEndTime(value);
  }

  const createEvent = async (e) => {
    e.preventDefault();

    console.log("Chegou aqui")
    try {
      console.log("Enviando dados:", { eventName, eventCity, eventPlace, eventDate, eventStartTime, eventEndTime })

      const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony`, {
        eventName,
        eventCity,
        eventPlace,
        eventDate,
        eventStartTime,
        eventEndTime
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      console.log("Evento cadastrado com sucesso: ", response)
      navigate('/Ceremony');
    } catch (error) {
      console.log(error);
    }
    console.log("Evento criado com sucesso");
  }

  const updateEvent = async (e) => {
    e.preventDefault();

    console.log("Chegou aqui")
    try {
      console.log("Enviando dados:", { eventName, eventCity, eventPlace, eventDate, eventStartTime, eventEndTime })

      const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony/` + routerParams.id, {
        eventName,
        eventCity,
        eventPlace,
        eventDate,
        eventStartTime,
        eventEndTime
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      console.log("Evento cadastrado com sucesso: ", response)
      navigate('/Ceremony');
    } catch (error) {
      console.log(error);
    }
    console.log("Evento criado com sucesso");
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-zinc-700">
      <Header className="top-0 left-0" />

      <div className="w-10/12 flex flex-grow justify-center items-center">
        <form className="w-full flex flex-col gap-4 p-8">
          <LabeledInput description="Evento" placeholder="XXXVII Evento do Lúdico" type="text" name="eventName" value={eventName} onChange={changeEventName} />
          <LabeledInput description="Cidade" placeholder="Cornélio Procópio" type="text" name="eventCity" value={eventCity} onChange={changeEventCity} />
          <LabeledInput description="Local" placeholder="Hall da UTFPR de Cornélio Procópio" type="text" name="eventPlace" value={eventPlace} onChange={changeEventPlace} />
          <div className="flex gap-24 w-full items-center">
            <LabeledInput description="Data" placeholder="20/04/2024" type="date" name="eventDate" value={eventDate} onChange={changeEventDate} />
            <LabeledInput description="Início" placeholder="13:00" type="time" name="eventStartTime" value={eventStartTime} onChange={changeEventStartTime} />
            <LabeledInput description="Fim" placeholder="Hall da UTFPR de Cornélio Procópio" type="time" name="eventEndTime" value={eventEndTime} onChange={changeEventEndTime} />
          </div>
          <div className="w-104 m-auto mt-16">
            {routerParams.id ?
              <PrimaryButton
                className="text-2xl font-bold px-8"
                text="Salvar Alterações"
                onClick={updateEvent}
              />
              :
              <PrimaryButton
                className="text-2xl font-bold px-8"
                text="Criar Evento"
                onClick={createEvent}
              />
            }
          </div>
        </form>
      </div>

    </div>
  )
}