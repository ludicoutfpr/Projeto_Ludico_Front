import { useState, useCallback } from "react";
import { LabeledInput } from "../../../../components/Input";
import { PrimaryButton } from "../../../../components/Button";
import { Table } from "../../../../components/Table";
import { Modal } from "../../../../components/Modal";
import axios from "axios";
import { debounce } from "lodash";

export function GamesList({ data, fetchData }) {
    const [isAddingGame, setIsAddingGame] = useState(false);
    const [barcode, setBarcode] = useState("");
    const [barcodeErrorMessage, setBarcodeErrorMessage] = useState("");
    const [boardgame, setBoardgame] = useState({});
    const [addBoardgameErrorMessage, setAddBoardgameErrorMessage] = useState("");
    const token = localStorage.getItem('authToken');

    const changeBarcodeInput = (e) => {
        const value = e.target.value;
        setBarcode(value);
        searchGame(value);
    }

    const searchGame = useCallback(
        debounce(async (input) => {
            try {
                setBarcodeErrorMessage("");
                if (input !== "") {
                    const cleanInput = input.replace(/\D/g, '');
                    const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/boardgame/search?qrCode=` + cleanInput, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })

                    if (response.status === 200 && response?.data) {
                        setBoardgame(response.data);
                    } else {
                        setBarcodeErrorMessage("Jogo não encontrado");
                        setBoardgame({});
                    }
                }
            } catch (error) {
                setBoardgame({});
                if (error?.response?.data === "error: boardgame not found") {
                    document.getElementById("gameNotInTheSystemModal")?.showModal();
                } else {
                    setBarcodeErrorMessage("Erro ao buscar jogo");
                }
            }
        }, 1000),
        [],
    );

    const handleAddboardGameToEvent = async () => {
        setAddBoardgameErrorMessage("")
        if (!boardgame?.qrCode) {
            setAddBoardgameErrorMessage("Nenhum jogo selecionado!")
            return;
        }
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony/${data._id}/addBoardGame`, {
                boardGameId: boardgame.qrCode
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 200) {
                await fetchData();
                setIsAddingGame(false);
                setBoardgame({});
                setBarcode("");
            } else {
                setAddBoardgameErrorMessage("Erro ao adicionar o jogo!");
            }
        } catch (error) {
            console.log(error);
            setAddBoardgameErrorMessage("Nenhum jogo selecionado!");
        }
    }

    const handleRemoveBoardGameFromCeremony = async (item) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_BASE_URL}/ceremony/${data._id}/removeBoardGame`, {
                boardGameId: item._id
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 200) {
                await fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {isAddingGame ?
                <div className="flex flex-col items-center mt-8">
                    <div className="w-1/3 flex flex-col gap-4">
                        <LabeledInput
                            description="Código de barras"
                            placeholder="0000000"
                            className="w-1/2 h-14 bg-amber-50 text-zinc-900 m-0 text-2xl p-2 rounded-lg"
                            toUppercase={false}
                            value={barcode}
                            onChange={changeBarcodeInput}
                            errorMessage={barcodeErrorMessage}
                        />
                        <LabeledInput
                            description="Jogo"
                            value={boardgame?.boardGameName ?? ""}
                            disabled={true}
                            toUppercase={false}
                        />
                        {addBoardgameErrorMessage &&
                            <span className="text-red-400 font-bold text-center">{addBoardgameErrorMessage}</span>
                        }
                        <PrimaryButton
                            className="text-2xl font-bold px-8 mt-6"
                            onClick={() => handleAddboardGameToEvent()}
                            text="Adicionar ao evento"
                        />
                    </div>
                </div>
                :
                <div className="w-full flex flex-col items-center mt-4">
                    <Table
                        column={["Jogo", "Proprietário", "Status"]}
                        data={data?.boardGamesAvailables?.map(item => {
                            return {
                                _id: item._id,
                                name: item.boardGameName,
                                owner: item.owner,
                                status: item.isAvailable ? "Disponível" : "Emprestado"
                            }
                        })}

                        hasAddPresence={false}
                        hasEdit={false}
                        hasDelete={false}
                        hasGreenButton={true}
                        greenButtonContent="Guardar"
                        onGreenButtonPress={handleRemoveBoardGameFromCeremony}
                    />
                    <div className="flex w-10/12 justify-end mt-9">
                        <div className="">
                            <PrimaryButton
                                className="text-3xl font-bold px-8"
                                onClick={() => setIsAddingGame(true)}
                                text="Cadastrar Jogo"
                            />
                        </div>
                    </div>
                </div>
            }
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
                                // Empurra o user para o cadastro de jogo (form grandão)
                                document.getElementById("gameNotInTheSystemModal")?.close();
                            }}
                        />
                    </div>
                }
            />
        </>
    )
}