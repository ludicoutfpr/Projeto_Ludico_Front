import { useState, useEffect, useCallback } from "react";
import { LabeledInput } from "../../../components/Input";
import { PrimaryButton } from "../../../components/Button";
import { Table } from "../../../components/Table";
import { LabeledSelect } from "../../../components/Select";
import axios from "axios";

export function Campaign({ data, tabsComponent, rpgSystems, getCampaigns }) {
    const [isAddingCampaign, setIsAddingCampaign] = useState(false);
    const [campaingName, setCampaingName] = useState("");
    const [master, setMaster] = useState("");
    const [quantityOfPlayers, setQuantityOfPlayers] = useState("");
    const [history, setHistory] = useState("");
    const [schedule, setSchedule] = useState("");
    const [isOnline, setIsOnline] = useState("");
    const [place, setPlace] = useState("");
    const [rpgSystem, setRpgSystem] = useState("");
    const [theme, setTheme] = useState("");
    const [ticklish, setTicklish] = useState("");
    const [addCampaignError, setAddCampaignError] = useState("");
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('authToken');

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

    const changeName = (e) => {
        const value = e.target.value;
        setCampaingName(value);
    }

    const changeMaster = (e) => {
        const value = e.target.value;
        setMaster(value);
    }

    const changeQuantityOfPlayers = (e) => {
        const value = e.target.value;
        setQuantityOfPlayers(value);
    }

    const changeHistory = (e) => {
        const value = e.target.value;
        setHistory(value);
    }

    const changeSchedule = (e) => {
        const value = e.target.value;
        setSchedule(value);
    }

    const changeIsOnline = (e) => {
        const value = e.target.value;
        setIsOnline(value);
    }

    const changePlace = (e) => {
        const value = e.target.value;
        setPlace(value);
    }

    const changeRpgSystem = (e) => {
        const value = e.target.value;
        setRpgSystem(value);
    }

    const changeTheme = (e) => {
        const value = e.target.value;
        setTheme(value);
    }

    const changeTicklish = (e) => {
        const value = e.target.value;
        setTicklish(value);
    }

    const cleanInputs = () => {
        setCampaingName("");
        setMaster("");
        setQuantityOfPlayers("");
        setHistory("");
        setSchedule("");
        setPlace("");
        setRpgSystem("");
        setTheme("");
        setTicklish("");
    }

    const handleAddCampaign = async () => {
        setAddCampaignError("");
        if (!(campaingName && master && quantityOfPlayers && history && schedule && isOnline && place && rpgSystem && theme && ticklish)) {
            setAddCampaignError("Preencha todos os campos");
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/campaing`, {
                campaingName,
                master,
                quantityOfPlayers,
                history,
                schedule,
                place,
                system: rpgSystem,
                theme,
                ticklish,
                isOnline: isOnline === "online",
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 201) {
                getCampaigns();
                setIsAddingCampaign(false);
                cleanInputs();
            }
        } catch (error) {
            console.log("Erro ao criar campanha!", error);
            setAddCampaignError("Erro ao criar campanha")
        }
    }

    return (
        <>
            {<>
                {isAddingCampaign ?
                    <div className="flex flex-col items-center">
                        <div className="w-1/2 flex flex-col gap-4">
                            {tabsComponent}
                            <LabeledInput
                                description="Nome da Campanha"
                                placeholder="Campanha"
                                toUppercase={false}
                                value={campaingName}
                                onChange={changeName}
                            />
                            <div className="flex gap-12 items-start">
                                <LabeledSelect
                                    description="Mestre"
                                    options={[
                                        { id: "", text: "Selecione" },
                                        ...users.map(user => ({ id: user._id, text: user.name }))
                                    ]}
                                    toUppercase={false}
                                    value={master}
                                    onChange={changeMaster}
                                />
                                <LabeledInput
                                    description="Máximo de jogadores"
                                    type="number"
                                    placeholder="6"
                                    toUppercase={false}
                                    value={quantityOfPlayers}
                                    onChange={changeQuantityOfPlayers}
                                />
                            </div>
                            <LabeledInput
                                description="História"
                                placeholder="História da campanha"
                                toUppercase={false}
                                value={history}
                                onChange={changeHistory}
                            />
                            <div className="flex gap-12 items-start">
                                <LabeledInput
                                    description="Horário"
                                    type="datetime-local"
                                    toUppercase={false}
                                    value={schedule}
                                    onChange={changeSchedule}
                                />
                                <LabeledSelect
                                    description="Formato"
                                    options={[
                                        { id: "", text: "Selecione" },
                                        { id: "online", text: "online" },
                                        { id: "presencial", text: "presencial" },
                                    ]}
                                    toUppercase={false}
                                    value={isOnline}
                                    onChange={changeIsOnline}
                                />
                            </div>
                            <LabeledInput
                                description="Local"
                                toUppercase={false}
                                value={place}
                                onChange={changePlace}
                            />
                            <LabeledSelect
                                description="Sistema"
                                options={[
                                    { id: "", text: "Selecione" },
                                    ...rpgSystems?.map(item => ({ id: item._id, text: item.name }))
                                ]}
                                toUppercase={false}
                                value={rpgSystem}
                                onChange={changeRpgSystem}
                            />
                            <LabeledInput
                                description="Temática"
                                toUppercase={false}
                                value={theme}
                                onChange={changeTheme}
                            />
                            <LabeledInput
                                description="Assuntos sensíveis"
                                toUppercase={false}
                                value={ticklish}
                                onChange={changeTicklish}
                            />
                            {addCampaignError &&
                                <span className="text-red-400 font-bold text-center">{addCampaignError}</span>
                            }
                            <div className="flex justify-center">
                                <PrimaryButton
                                    className="w-1/3 text-2xl font-bold px-8 mt-6"
                                    onClick={handleAddCampaign}
                                    text="Cadastrar"
                                    fullWidth={false}
                                />
                            </div>
                        </div>
                    </div>
                    :
                    <div className="w-full flex flex-col px-14 mt-4">
                        {tabsComponent}
                        <Table
                            column={["Mestre", "Sistema", "Personagens", "Campanha"]}
                            data={data?.map(item => {
                                return {
                                    _id: item._id,
                                    master: item.master?.name,
                                    rpgSystem: item.system?.name,
                                    characters: `${item.characters?.length || 0}/${item.quantityOfPlayers}`,
                                    campaign: item.campaingName,
                                }
                            })}
                            hasEdit={false}
                            hasDelete={false}
                            hasAddPlayer={false}
                            hasAddPresence={false}
                        />
                        <div className="flex w-full justify-end mt-9">
                            <div className="">
                                <PrimaryButton
                                    className="text-2xl font-bold px-8"
                                    onClick={() => setIsAddingCampaign(true)}
                                    text="cadastrar campanha"
                                />
                            </div>
                        </div>
                    </div>
                }
            </>}
        </>
    )
}