import { useState, useEffect, useCallback } from "react";
import { LabeledInput } from "../../../components/Input";
import { PrimaryButton } from "../../../components/Button";
import { Table } from "../../../components/Table";
import { LabeledSelect } from "../../../components/Select";
import { Modal } from "../../../components/Modal";
import axios from "axios";
import { debounce } from "lodash";

export function Character({ data, tabsComponent, getCharacters, campaigns, getCampaigns }) {
    const [isAddingCharacter, setIsAddingCharacter] = useState(false);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [race, setRace] = useState("");
    const [campaign, setCampaign] = useState("");
    const [characterClass, setCharacterClass] = useState("");
    const [heritage, setHeritage] = useState("");
    const [religion, setReligion] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [background, setBackground] = useState("");
    const [addCharacterError, setAddCharacterError] = useState("");
    const [identifierErrorMessage, setIdentifierErrorMessage] = useState("");
    const [selectedParticipator, setSelectedParticipator] = useState({});
    const token = localStorage.getItem('authToken');

    const changeName = (e) => {
        const value = e.target.value;
        setName(value);
    }

    const changeIdentifier = (e) => {
        const value = e.target.value;
        setIdentifier(value);
        searchParticipator(value);
    }

    const changeEmail = (e) => {
        const value = e.target.value;
        setRace(value);
    }

    const changeCampaign = (e) => {
        const value = e.target.value;
        setCampaign(value);
    }

    const changeCharacterClass = (e) => {
        const value = e.target.value;
        setCharacterClass(value);
    }

    const changeHeritage = (e) => {
        const value = e.target.value;
        setHeritage(value);
    }

    const changeReligion = (e) => {
        const value = e.target.value;
        setReligion(value);
    }

    const changeAge = (e) => {
        const value = e.target.value;
        setAge(value);
    }

    const changeGender = (e) => {
        const value = e.target.value;
        setGender(value);
    }

    const changeBackground = (e) => {
        const value = e.target.value;
        setBackground(value);
    }

    const searchParticipator = useCallback(
        debounce(async (input) => {
            try {
                setIdentifierErrorMessage("");
                if (input !== "") {
                    const cleanInput = input.replace(/\D/g, '');
                    const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/participator/search?identifier=${cleanInput}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(response?.data);
                    if (response?.data?.[0]) {
                        setSelectedParticipator(response?.data?.[0]);
                    } else {
                        setSelectedParticipator({});
                        setIdentifierErrorMessage("RA/CPF não encontrado")
                    }
                }
            } catch (error) {
                console.log(error);
                setIdentifierErrorMessage("Erro na busca")
                setSelectedParticipator({});
            }
        }, 1000),
        [],
    );

    const cleanInputs = () => {
        setName("");
        setUsername("");
        setIdentifier("");
        setRace("");
        setCampaign("");
        setCharacterClass("");
        setHeritage("");
        setReligion("");
    }

    const handleAddUser = async () => {
        setAddCharacterError("");
        if (!(name && selectedParticipator?._id && race && campaign && characterClass && heritage && religion && age && gender && background)) {
            setAddCharacterError("Preencha todos os campos");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/character`, {
                name,
                player: selectedParticipator?._id,
                campaing: campaign,
                race,
                class: characterClass,
                heritage,
                religion,
                age,
                gender,
                background,
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 200) {
                getCharacters();
                getCampaigns();
                setIsAddingCharacter(false);
                cleanInputs();
            }
        } catch (error) {
            console.log("Erro ao criar personagem!", error);
            setAddCharacterError("Erro ao criar personagem")
        }
    }

    return (
        <>
            {<>
                {isAddingCharacter ?
                    <div className="flex flex-col items-center">
                        <div className="w-1/2 flex flex-col gap-4">
                            {tabsComponent}
                            <LabeledInput
                                description="Nome do personagem"
                                placeholder="Nome"
                                toUppercase={false}
                                value={name}
                                onChange={changeName}
                            />
                            <div className="flex gap-12 items-start">
                                <LabeledInput
                                    description="RA/CPF do jogador"
                                    placeholder="00000000"
                                    toUppercase={false}
                                    value={identifier}
                                    onChange={changeIdentifier}
                                    errorMessage={identifierErrorMessage}
                                />
                                <LabeledInput
                                    description="Nome do jogador"
                                    toUppercase={false}
                                    value={selectedParticipator?.name}

                                />
                            </div>
                            <LabeledSelect
                                description="Campanha"
                                options={[
                                    { id: "", text: "Selecione" },
                                    ...campaigns
                                        ?.filter(item => item?.characters?.length < item?.quantityOfPlayers)
                                        ?.map(item => ({ id: item._id, text: item.campaingName }))
                                ]}
                                toUppercase={false}
                                value={campaign}
                                onChange={changeCampaign}
                            />
                            <div className="flex gap-12 items-start">
                                <LabeledInput
                                    description="Raça"
                                    placeholder="Raça"
                                    toUppercase={false}
                                    value={race}
                                    onChange={changeEmail}
                                />
                                <LabeledSelect
                                    description="Classe"
                                    options={[
                                        (campaign ? { id: "", text: "Selecione" } : { id: "", text: "Selecione uma campanha" }),
                                        ...(campaigns?.find(item => item._id === campaign)?.system?.class?.map(item => ({ id: item, text: item })) || [])
                                    ]}
                                    toUppercase={false}
                                    value={characterClass}
                                    onChange={changeCharacterClass}
                                />
                            </div>
                            <div className="flex gap-12 items-end">
                                <LabeledInput
                                    description="Herança"
                                    placeholder="Herança"
                                    toUppercase={false}
                                    value={heritage}
                                    onChange={changeHeritage}
                                />
                                <LabeledInput
                                    description="Religião"
                                    placeholder="Religião"
                                    toUppercase={false}
                                    value={religion}
                                    onChange={changeReligion}
                                />
                            </div>
                            <div className="flex gap-12 items-end">
                                <LabeledInput
                                    description="Idade do personagem"
                                    placeholder="50"
                                    type="number"
                                    toUppercase={false}
                                    value={age}
                                    onChange={changeAge}
                                />
                                <LabeledSelect
                                    description="Sexo do personagem"
                                    options={[
                                        { id: "", text: "Selecione" },
                                        { id: "male", text: "Masculino" },
                                        { id: "female", text: "Feminino" },
                                    ]}
                                    toUppercase={false}
                                    value={gender}
                                    onChange={changeGender}
                                />
                            </div>
                            <LabeledInput
                                description="Background"
                                placeholder="Background do personagem"
                                toUppercase={false}
                                value={background}
                                onChange={changeBackground}
                            />
                            {addCharacterError &&
                                <span className="text-red-400 font-bold text-center">{addCharacterError}</span>
                            }
                            <div className="flex justify-center">
                                <PrimaryButton
                                    className="w-1/3 text-2xl font-bold px-8 mt-6"
                                    onClick={handleAddUser}
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
                            column={["Nome", "Player", "Campanha"]}
                            data={data?.map(item => {
                                return {
                                    _id: item._id,
                                    name: item.name,
                                    player: item.player?.name,
                                    campaign: item.campaing?.campaingName
                                }
                            })}
                            hasEdit={false}
                            hasDelete={false}
                            hasAddPresence={false}
                        />
                        <div className="flex w-full justify-end mt-9">
                            <div className="">
                                <PrimaryButton
                                    className="text-2xl font-bold px-8"
                                    onClick={() => setIsAddingCharacter(true)}
                                    text="cadastrar personagem"
                                />
                            </div>
                        </div>
                    </div>
                }
            </>}
        </>
    )
}