import { useState, useEffect, useCallback } from "react";
import { LabeledInput } from "../../../../components/Input";
import { PrimaryButton } from "../../../../components/Button";
import { Table } from "../../../../components/Table";
import { LabeledSelect } from "../../../../components/Select";
import { Modal } from "../../../../components/Modal";
import axios from "axios";
import { debounce } from "lodash";

export function OneShotsList({ data, setSelectedTab, fetchData }) {
    const [isAddingOneShot, setIsAddingOneShot] = useState(false);
    const [isAddingParticipant, setIsAddingParticipants] = useState(false);
    const [selectedOneShot, setSelectedOneShot] = useState({});
    const [rpgSystems, setRpgSystems] = useState([]);
    const [users, setUsers] = useState([]);
    const [participatorIdInput, setParticipatorIdInput] = useState();
    const [participatorErrorMessage, setParticipatorErrorMessage] = useState("");
    const [selectedParticipator, setSelectedParticipator] = useState({});
    const [name, setName] = useState("");
    const [system, setSystem] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [master, setMaster] = useState("");
    const [duration, setDuration] = useState("");
    const [addOneShotError, setAddOneShotError] = useState(false);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        getRpgSystem();
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

    const getRpgSystem = async () => {
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

    const changeNameInput = (e) => {
        const value = e.target.value;
        setName(value);
    }

    const changeSystem = (e) => {
        const value = e.target.value;
        setSystem(value);
    }

    const changeMaxParticipants = (e) => {
        const value = e.target.value;
        setMaxParticipants(value);
    }

    const changeMaster = (e) => {
        const value = e.target.value;
        setMaster(value);
    }

    const changeDuration = (e) => {
        const value = e.target.value;
        setDuration(value);
    }

    const changeParticipatorIdInput = (e) => {
        const value = e.target.value;
        setParticipatorIdInput(value);
        searchParticipator(value);
    }

    const cleanInputs = () => {
        setName("");
        setSystem("");
        setMaxParticipants("");
        setMaster("");
        setDuration("");
    }

    const searchParticipator = useCallback(
        debounce((input) => {
            try {
                setParticipatorErrorMessage("");
                if (input !== "") {
                    const cleanInput = input.replace(/\D/g, '');
                    const result = data.participators.find(participator => participator.identifier === cleanInput);

                    if (result) {
                        setSelectedParticipator(result);
                    } else {
                        document.getElementById("participatorNotInTheCeremonyModal")?.showModal();
                        setSelectedParticipator({});
                    }
                }
            } catch (error) {
                setSelectedParticipator({});
            }
        }, 1000),
        [],
    );

    const handleAddPlayerRedirect = async (item) => {
        const numberOfPlayers = Number(item.formattedPlayers.split("/")[0]);
        const maxOfPlayers = Number(item.formattedPlayers.split("/")[1]);
        if (numberOfPlayers < maxOfPlayers) {
            setSelectedOneShot(data.oneShotAvailables?.find(oneShot => oneShot._id === item._id));
            setIsAddingParticipants(true);
        }
        return;
    }

    const handleAddOneShot = async () => {
        setAddOneShotError(false);

        if (!(name && system && maxParticipants && master && duration)) {
            setAddOneShotError(true);
            return;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony/${data._id}/addOneShot`, {
                adventure: name,
                master,
                quantityOfPlayers: maxParticipants,
                system,
                isOnline: false,
                sessionDuration: duration,
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 200) {
                await fetchData();
                setIsAddingOneShot(false);
                cleanInputs();
            } else {
                setAddOneShotError(true);
            }
        } catch (error) {
            console.log(error);
            setAddOneShotError(true);
        }
    }

    const handleAddPlayer = async () => {
        if (!selectedParticipator._id) {
            return
        }
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/oneShot/${selectedOneShot._id}/addParticipator`, {
                participatorId: selectedParticipator.identifier
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 200) {
                await fetchData();
                setParticipatorIdInput("");
                setSelectedParticipator({});
                setIsAddingParticipants(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {isAddingOneShot ?
                <div className="flex flex-col items-center mt-8">
                    <div className="w-1/2 flex flex-col gap-4">
                        <LabeledInput
                            description="Aventura"
                            placeholder="Aventura oneshot"
                            toUppercase={false}
                            value={name}
                            onChange={changeNameInput}
                        />
                        <div className="flex gap-12 items-end">
                            <LabeledSelect
                                description="Sistema"
                                options={[
                                    { id: "", text: "Selecione" },
                                    ...rpgSystems.map(system => ({ id: system._id, text: system.name }))
                                ]}
                                toUppercase={false}
                                value={system}
                                onChange={changeSystem}
                            />
                            <LabeledInput
                                description="Quantidade máxima de participantes"
                                placeholder={5}
                                type="number"
                                toUppercase={false}
                                value={maxParticipants}
                                onChange={changeMaxParticipants}
                            />
                        </div>
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
                        <LabeledSelect
                            description="Duração"
                            options={[
                                { id: "", text: "Selecione" },
                                { id: "1h", text: "1h" },
                                { id: "1:30h", text: "1:30h" },
                                { id: "2h", text: "2h" },
                                { id: "3h", text: "3h" },
                                { id: "4h", text: "4h" }
                            ]}
                            toUppercase={false}
                            value={duration}
                            onChange={changeDuration}
                        />
                        {addOneShotError &&
                            <span className="text-red-400 font-bold text-center">Preencha todos os campos</span>
                        }
                        <div className="flex justify-center">
                            <PrimaryButton
                                className="w-fit text-2xl font-bold px-8 mt-6"
                                onClick={handleAddOneShot}
                                text="Adicionar ao evento"
                                fullWidth={false}
                            />
                        </div>
                    </div>
                </div>
                :
                isAddingParticipant ?
                    <div className="flex flex-col items-center mt-8">
                        <div className="w-1/2 flex flex-col gap-4">
                            <LabeledInput
                                description="CPF ou RA"
                                placeholder="0000000"
                                value={participatorIdInput}
                                onChange={changeParticipatorIdInput}
                                errorMessage={participatorErrorMessage}
                                toUppercase={false}
                            />
                            <LabeledInput
                                description="Participante"
                                value={selectedParticipator?.name || ""}
                                disabled={true}
                                toUppercase={false}
                            />
                            <div className="flex justify-center w-full">
                                <PrimaryButton
                                    className="text-2xl font-bold px-8 mt-6 w-fit"
                                    onClick={handleAddPlayer}
                                    text="Adicionar participante"
                                    fullWidth={false}
                                />
                            </div>
                        </div>
                    </div>
                    :
                    <div className="w-full flex flex-col px-14 mt-4">
                        <Table
                            column={["Aventura", "Duração", "Sistema", "Mestre", "Participantes"]}
                            data={data.oneShotAvailables?.map(item => {
                                return {
                                    _id: item._id,
                                    adventure: item.adventure,
                                    sessionDuration: item.sessionDuration,
                                    system: item.system?.name,
                                    master: item.master?.name,
                                    formattedPlayers: `${item.players?.length || 0}/${item.quantityOfPlayers}`,
                                }
                            })}
                            hasEdit={false}
                            hasDelete={false}
                            hasAddPresence={false}
                            hasAddPlayer={true}
                            onAddPlayer={handleAddPlayerRedirect}
                        />
                        <div className="flex w-full justify-end mt-9">
                            <div className="">
                                <PrimaryButton
                                    className="text-2xl font-bold px-8"
                                    onClick={() => setIsAddingOneShot(true)}
                                    text="cadastrar oneshot"
                                />
                            </div>
                        </div>
                    </div>
            }
            <Modal
                modalId="participatorNotInTheCeremonyModal"
                content={
                    <div className="w-full flex flex-col gap-4 px-8 items-center">
                        <span className="font-bold text-2xl text-center text-white">
                            Participante não cadastrado no evento, <br />deseja cadastrar o participante?
                        </span>
                        <PrimaryButton
                            className="text-2xl font-bold px-8 my-4 w-10/12"
                            text="Cadastrar"
                            toUppercase={false}
                            fullWidth={false}
                            onClick={async () => {
                                setSelectedTab("participantRegister");
                                document.getElementById("participatorNotInTheCeremonyModal")?.close();
                            }}
                        />
                    </div>
                }
            />
        </>
    )
}