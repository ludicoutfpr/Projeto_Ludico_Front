import { useState, useCallback } from "react";
import { useNavigate } from 'react-router'
import { LabeledInput } from "../../../../components/Input";
import { PrimaryButton } from "../../../../components/Button";
import { Table } from "../../../../components/Table";
import { Modal } from "../../../../components/Modal";
import axios from "axios";
import { debounce } from "lodash";

export function CeremonyManaging({ data, lentData, fetchLentData, setSelectedTab }) {
    const [participatorIdInput, setParticipatorIdInput] = useState();
    const [selectedParticipator, setSelectedParticipator] = useState({});
    const [participatorErrorMessage, setParticipatorErrorMessage] = useState("");
    const [boardgameLentInput, setBoardgameLentInput] = useState("");
    const [boardgameLentErrorMessage, setBoardgameLentErrorMessage] = useState("");
    const [participatorLentInput, setParticipatorLentInput] = useState("");
    const [participatorLentErrorMessage, setParticipatorLentErrorMessage] = useState("");
    const [selectedLentId, setSelectedLentId] = useState();
    const [playerCount, setPlayerCount] = useState();
    const [playedTimes, setPlayedTimes] = useState();
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    console.log(data)

    const changeParticipatorIdInput = (e) => {
        const value = e.target.value;
        setParticipatorIdInput(value);
        searchParticipator(value);
    }

    const changePlayerCount = (e) => {
        const value = e.target.value;
        setPlayerCount(value);
    }

    const changePlayedTimes = (e) => {
        const value = e.target.value;
        setPlayedTimes(value);
    }

    const changeBoardgameLentInput = (e) => {
        const value = e.target.value;
        setBoardgameLentInput(value);
    }

    const changeParticipatorLentInput = (e) => {
        const value = e.target.value;
        setParticipatorLentInput(value);
    }

    const handleAddParticipator = async () => {
        if (selectedParticipator?._id) {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony/${data._id}/addParticipator`, {
                participatorId: selectedParticipator?.identifier
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            if (response.status === 200) {
                setParticipatorIdInput("");
                setSelectedParticipator({});
            }
        } else {
            document.getElementById("participatorNotInTheSystemModal")?.showModal();
        }
    }

    const handleLentGame = async () => {
        setBoardgameLentErrorMessage("");
        setParticipatorLentErrorMessage("");
        if (!boardgameLentInput || !participatorLentInput) {
            if (!boardgameLentInput)
                setBoardgameLentErrorMessage("Preencha o campo");

            if (!participatorLentInput)
                setParticipatorLentErrorMessage("Preencha o campo")

            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony/${data._id}/lent`, {
                boardgameLent: boardgameLentInput,
                participator: participatorLentInput
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

            if (response.status === 200) {
                fetchLentData();
                setParticipatorLentInput("");
                setBoardgameLentInput("");
                document.getElementById("returnGameModal")?.close();
            }
        } catch (error) {
            if (error?.response?.data?.message === "Jogo não encontrado") {
                document.getElementById("gameNotInTheCeremonyModal")?.showModal();
            } else if (error?.response?.data?.message === "Participador não encontrado") {
                document.getElementById("participatorNotInTheCeremonyModal")?.showModal();
            } else if (error?.response?.data?.message === "Participador não existe no sistema") {
                document.getElementById("participatorNotInTheSystemModal")?.showModal();
            } else if (error?.response?.data?.message === "Jogo não existe no sistema") {
                document.getElementById("gameNotInTheSystemModal")?.showModal();
            } else if (error?.response?.data === "Jogo indisponivel") {
                setBoardgameLentErrorMessage("Jogo indisponível");
            } else {
                console.log(error);
            }
        }
    }

    const handleReturnGame = async () => {
        try {
            console.log(selectedLentId);
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/lent/` + selectedLentId, {
                playedTimes,
                playerCount
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

            if (response.status === 200) {
                fetchLentData();
                document.getElementById("returnGameModal")?.close();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const searchParticipator = useCallback(
        debounce(async (input) => {
            try {
                setParticipatorErrorMessage("");
                if (input !== "") {
                    const cleanInput = input.replace(/\D/g, '');
                    const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/participator/search?identifier=` + cleanInput, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })

                    if (response.status === 200 && response?.data?.[0]) {
                        setSelectedParticipator(response.data[0]);
                    } else {
                        setParticipatorErrorMessage("RA/CPF não encontrado");
                        setSelectedParticipator({});
                    }
                }
            } catch (error) {
                setSelectedParticipator({});
            }
        }, 1000),
        [],
    );

    const addBoardGameToCeremony = async (boardGameId) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony/${data._id}/addBoardGame`, {
                boardGameId
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
        } catch (error) {
            console.log(error);
        }
    }

    const addParticipatorToCeremony = async (participatorId) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony/${data._id}/addParticipator`, {
                participatorId
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-full flex flex-col mt-8">
            <div className="w-full flex justify-around">
                <div className="flex flex-col gap-4 w-1/3">
                    <LabeledInput
                        description="ra/cpf"
                        placeholder="9090909"
                        value={participatorIdInput}
                        onChange={changeParticipatorIdInput}
                        errorMessage={participatorErrorMessage}
                    />
                    <LabeledInput
                        description="Nome"
                        value={selectedParticipator?.name || ""}
                        disabled={true}
                        toUppercase={false}
                    />
                    <div className="flex items-center justify-center">
                        <PrimaryButton
                            className="w-10/12 text-3xl font-bold px-8 mt-8"
                            text="Adicionar Participante"
                            toUppercase={false}
                            fullWidth={false}
                            onClick={handleAddParticipator}
                        />
                    </div>
                </div>
                <div className="w-[1px] bg-white h-[350px]" />
                <div className="flex flex-col gap-4 w-1/3">
                    <LabeledInput
                        description="Jogo"
                        placeholder="Ticket to Ride Europe"
                        value={boardgameLentInput}
                        onChange={changeBoardgameLentInput}
                        errorMessage={boardgameLentErrorMessage}
                        toUppercase={false}
                    />
                    <LabeledInput
                        description="Solicitante"
                        placeholder="9090909"
                        value={participatorLentInput}
                        onChange={changeParticipatorLentInput}
                        errorMessage={participatorLentErrorMessage}
                        toUppercase={false}
                    />
                    <div className="flex items-center justify-center">
                        <PrimaryButton
                            className="w-10/12 text-3xl font-bold px-8 mt-8"
                            text="Emprestar Jogo"
                            onClick={handleLentGame}
                            toUppercase={false}
                            fullWidth={false}
                        />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-center mt-16">
                <Table
                    column={["Jogo emprestado", "Solicitante", "Horário"]}
                    data={lentData?.map(item => {
                        return {
                            _id: item._id,
                            boardgameLent: item.boardgameLent?.boardGameName,
                            participator: item.participator?.name,
                            lentTime: new Date(item.lentTime).toLocaleTimeString()
                        }
                    })}
                    hasAddPresence={false}
                    hasEdit={false}
                    hasDelete={false}
                    hasReturnGame={true}
                    onReturnGame={(item) => {
                        setSelectedLentId(item._id);
                        document.getElementById("returnGameModal")?.showModal();
                    }}
                />
            </div>
            <Modal
                modalId="participatorNotInTheSystemModal"
                content={
                    <div className="w-full flex flex-col gap-4 px-8 items-center">
                        <span className="font-bold text-2xl text-center text-white">
                            Participante não cadastrado na plataforma, <br />deseja cadastrar o participante?
                        </span>
                        <PrimaryButton
                            className="text-2xl font-bold px-8 my-4 w-10/12"
                            text="Cadastrar"
                            toUppercase={false}
                            fullWidth={false}
                            onClick={() => {
                                setSelectedTab("participantRegister");
                                document.getElementById("participatorNotInTheSystemModal")?.close();
                            }}
                        />
                    </div>
                }
            />
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
                                await addParticipatorToCeremony(participatorLentInput);
                                handleLentGame();
                                document.getElementById("participatorNotInTheCeremonyModal")?.close();
                            }}
                        />
                    </div>
                }
            />
            <Modal
                modalId="gameNotInTheCeremonyModal"
                content={
                    <div className="w-full flex flex-col gap-4 px-8 items-center">
                        <span className="font-bold text-2xl text-center text-white">
                            Jogo não cadastrado no evento, <br />deseja cadastrar o jogo?
                        </span>
                        <PrimaryButton
                            className="text-2xl font-bold px-8 my-4 w-10/12"
                            text="Cadastrar"
                            toUppercase={false}
                            fullWidth={false}
                            onClick={async () => {
                                await addBoardGameToCeremony(boardgameLentInput);
                                handleLentGame();
                                document.getElementById("gameNotInTheCeremonyModal")?.close();
                            }}
                        />
                    </div>
                }
            />
            <Modal
                modalId="gameNotInTheSystemModal"
                content={
                    <div className="w-full flex flex-col gap-4 px-8 items-center">
                        <span className="font-bold text-2xl text-center text-white">
                            Jogo não cadastrado na plataforma, <br />deseja cadastrar o jogo?
                        </span>
                        <PrimaryButton
                            className="text-2xl font-bold px-8 my-4 w-10/12"
                            text="Cadastrar"
                            toUppercase={false}
                            fullWidth={false}
                            onClick={() => {
                                document.getElementById("gameNotInTheSystemModal")?.close();
                                navigate("/BoardGame");
                            }}
                        />
                    </div>
                }
            />
            <Modal
                openerId="returnGame"
                modalId="returnGameModal"
                content={
                    <div className="">
                        <div className="w-full flex flex-col gap-4 px-8 items-center">
                            <LabeledInput
                                description="Quantas pessoas jogaram?"
                                placeholder="2"
                                type="number"
                                name="playerCount"
                                value={playerCount}
                                onChange={changePlayerCount}
                                toUppercase={false}
                            />
                            <LabeledInput
                                description="Quantas partidas completas foram jogadas?"
                                placeholder="1"
                                type="number"
                                name="playedTimes"
                                value={playedTimes}
                                onChange={changePlayedTimes}
                                toUppercase={false}
                            />
                            <PrimaryButton
                                className="text-2xl font-bold px-8 my-4 w-10/12"
                                text="Devolver"
                                toUppercase={false}
                                fullWidth={false}
                                onClick={() => handleReturnGame()}
                            />
                        </div>
                    </div>
                }
            />
        </div>
    )
}