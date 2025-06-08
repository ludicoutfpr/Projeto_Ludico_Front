import { useState, useEffect, useCallback } from "react";
import { LabeledInput } from "../../../components/Input";
import { PrimaryButton } from "../../../components/Button";
import { Table } from "../../../components/Table";
import { LabeledSelect } from "../../../components/Select";
import { Modal } from "../../../components/Modal";
import axios from "axios";
import { debounce } from "lodash";

export function RpgSystem({ data, tabsComponent, getRpgSystems }) {
    const [isAddingSystem, setIsAddingSystem] = useState(false);
    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [theme, setTheme] = useState("");
    const [category, setCategory] = useState("");
    const [addSystemError, setAddSystemError] = useState("");
    const [classList, setClassList] = useState([""]);
    const token = localStorage.getItem('authToken');

    const changeName = (e) => {
        const value = e.target.value;
        setName(value);
    }

    const changeAuthor = (e) => {
        const value = e.target.value;
        setAuthor(value);
    }

    const changeTheme = (e) => {
        const value = e.target.value;
        setTheme(value);
    }

    const changeCategory = (e) => {
        const value = e.target.value;
        setCategory(value);
    }

    const handleClassesChanges = (index, value) => {
        const updatedClasses = [...classList];
        updatedClasses[index] = value;
        setClassList(updatedClasses);
    }

    const handleAddTheme = () => {
        setClassList([...classList, ""]);
    }

    const cleanInputs = () => {
        setName("");
        setAuthor("");
        setTheme("");
        setCategory("");
        setClassList([""]);
    }

    const handleAddUser = async () => {
        setAddSystemError("");
        if (!(name && author && theme && category && !(classList.some(item => !item)))) {
            setAddSystemError("Preencha todos os campos");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_BASE_URL}/rpgSystem`, {
                name,
                author,
                theme,
                category,
                class: classList
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            if (response.status === 201) {
                getRpgSystems();
                setIsAddingSystem(false);
                cleanInputs();
            }
        } catch (error) {
            console.log("Erro ao criar sistema!", error);
            setAddSystemError("Erro ao criar sistema")
        }
    }

    return (
        <>
            {<>
                {isAddingSystem ?
                    <div className="flex flex-col items-center">
                        <div className="w-1/2 flex flex-col gap-4">
                            {tabsComponent}
                            <LabeledInput
                                description="Nome do Sistema"
                                placeholder="Sistema"
                                toUppercase={false}
                                value={name}
                                onChange={changeName}
                            />
                            <LabeledInput
                                description="Autor"
                                placeholder="Autor"
                                toUppercase={false}
                                value={author}
                                onChange={changeAuthor}
                            />
                            <LabeledSelect
                                description="Tema"
                                options={[
                                    { id: "", text: "Selecione" },
                                    { id: "Fantasia", text: "Fantasia" },
                                    { id: "Ficção Cientifica", text: "Ficção Cientifica" },
                                    { id: "Terror", text: "Terror" },
                                    { id: "Super-Heróis", text: "Super-Heróis" },
                                    { id: "Histórico", text: "Histórico" },
                                    { id: "Moderno", text: "Moderno" },
                                ]}
                                toUppercase={false}
                                value={theme}
                                onChange={changeTheme}
                            />
                            <LabeledSelect
                                description="Categoria"
                                options={[
                                    { id: "", text: "Selecione" },
                                    { id: "D6", text: "D6" },
                                    { id: "D10", text: "D10" },
                                    { id: "D20", text: "D20" },
                                    { id: "Outro", text: "Outro" },
                                ]}
                                toUppercase={false}
                                value={category}
                                onChange={changeCategory}
                            />
                            {classList.map((_class, idx) => (
                                <LabeledInput
                                    key={idx}
                                    description={idx === 0 ? "Classe" : `Classe ${idx + 1}`}
                                    placeholder="Classe do sistema"
                                    toUppercase={false}
                                    value={_class}
                                    onChange={e => handleClassesChanges(idx, e.target.value)}
                                />
                            ))}
                            <button
                                type="button"
                                className="text-zinc-50 text-left w-fit mb-2 text-xl"
                                onClick={handleAddTheme}
                            >
                                Adicionar outro tema
                            </button>
                            {addSystemError &&
                                <span className="text-red-400 font-bold text-center">{addSystemError}</span>
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
                            column={["Nome", "Temática", "Categoria"]}
                            data={data?.map(item => {
                                return {
                                    _id: item._id,
                                    name: item.name,
                                    theme: item.theme,
                                    category: item.category
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
                                    onClick={() => setIsAddingSystem(true)}
                                    text="cadastrar sistema"
                                />
                            </div>
                        </div>
                    </div>
                }
            </>}
        </>
    )
}