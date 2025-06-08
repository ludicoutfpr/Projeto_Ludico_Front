import { useState, useEffect, useCallback } from "react";
import { LabeledInput } from "../../../../components/Input";
import { PrimaryButton } from "../../../../components/Button";
import { Table } from "../../../../components/Table";
import { LabeledSelect } from "../../../../components/Select";
import { Modal } from "../../../../components/Modal";
import axios from "axios";
import { debounce } from "lodash";

export function ScapeRoomList({ data, setSelectedTab, fetchData }) {
    const [isAddingScapeRoom, setIsAddingScapeRoom] = useState(false);
    const [isAddingParticipant, setIsAddingParticipants] = useState(false);
    const [addScapeError, setAddScapeError] = useState("");
    const [selectedScapeRoom, setSelectedScapeRoom] = useState({});
    const [scapeRoomHistories, setScapeRoomHistories] = useState([]);
    const [participatorIdInput, setParticipatorIdInput] = useState();
    const [participatorErrorMessage, setParticipatorErrorMessage] = useState("");
    const [selectedParticipator, setSelectedParticipator] = useState({});
    const [history, setHistory] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [room, setRoom] = useState("");
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        getScapeRoomHistory();
    }, []);


    const getScapeRoomHistory = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/scapeRoomHistory`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setScapeRoomHistories(response.data);
        } catch (err) {
            console.log(err);
            setScapeRoomHistories([]);
        }
    }

    const changeParticipatorIdInput = (e) => {
        const value = e.target.value;
        setParticipatorIdInput(value);
        searchParticipator(value);
    }

    const changeHistory = (e) => {
        setHistory(e.target.value);
    }

    const changeStart = (e) => {
        setStart(e.target.value);
    }

    const changeEnd = (e) => {
        setEnd(e.target.value);
    }

    const changeRoom = (e) => {
        setRoom(e.target.value);
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
            setSelectedScapeRoom(data.scapeRoomSessions?.find(session => session._id === item._id));
            setIsAddingParticipants(true);
        }
        return;
    }

    const handleAddScapeRoom = async () => {
        setAddScapeError("");

        if (!(history && start && end && room)) {
            setAddScapeError("Preencha todos os campos");
            return;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony/${data._id}/addScapeRoomSession`, {
                startedAt: start,
                finishedAt: end,
                history,
                room
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 200) {
                await fetchData();
                setIsAddingScapeRoom(false);
                cleanInputs();
            } else {
                setAddScapeError("Erro ao adicionar ao evento!");
            }
        } catch (error) {
            console.log(error);
            setAddScapeError("Erro ao adicionar ao evento!");
        }
    }

    const cleanInputs = () => {
        setHistory("");
        setStart("");
        setEnd("");
    }

    const handleAddPlayer = async () => {
        if (!selectedParticipator._id) {
            return
        }
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/scapeRoomSession/${selectedScapeRoom._id}/addParticipator`, {
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
            {isAddingScapeRoom ?
                <div className="flex flex-col items-center mt-8">
                    <div className="w-1/2 flex flex-col gap-4">
                        <LabeledSelect
                            description="História"
                            options={[
                                { id: "", text: "Selecione" },
                                ...scapeRoomHistories.map(system => ({ id: system._id, text: system.name }))
                            ]}
                            value={history}
                            onChange={changeHistory}
                            toUppercase={false}
                        />
                        <LabeledInput
                            description="Sala"
                            toUppercase={false}
                            placeholder="Sala 3"
                            value={room}
                            onChange={changeRoom}
                        />
                        <div className="flex gap-12 items-end">
                            <LabeledInput
                                description="Inicio"
                                toUppercase={false}
                                type="time"
                                value={start}
                                onChange={changeStart}
                            />
                            <LabeledInput
                                description="Fim"
                                type="time"
                                toUppercase={false}
                                value={end}
                                onChange={changeEnd}
                            />
                        </div>
                        {addScapeError &&
                            <span className="text-red-400 font-bold text-center">{addScapeError}</span>
                        }
                        <div className="flex justify-center">
                            <PrimaryButton
                                className="w-fit text-2xl font-bold px-8 mt-6"
                                onClick={handleAddScapeRoom}
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
                            column={["Sala", "Duração", "Horário de inicio", "Participantes"]}
                            data={data.scapeRoomSessions?.map(item => {
                                return {
                                    _id: item._id,
                                    room: item.room,
                                    duration: item.history?.duration,
                                    start: item.startedAt,
                                    formattedPlayers: `${item.participators?.length || 0}/${item.history?.maxPlayerQuantity}`,
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
                                    onClick={() => setIsAddingScapeRoom(true)}
                                    text="adicionar sala"
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