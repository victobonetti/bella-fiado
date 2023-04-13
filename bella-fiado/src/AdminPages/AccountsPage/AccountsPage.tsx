import { useState, useEffect, useLayoutEffect, FormEvent } from "react";
import { AccountsServices } from "../AdminServices/AccountsServices";
import { IAccount } from "../../Interfaces";
import TableComponent from "../AdminPages_components/Tables/Tables/TablesComponent";
import { Loader } from "../AdminPages_components/Loader_Error/Loader_Error/Loader";
import { ErrorMessage } from "../AdminPages_components/Loader_Error/Loader_Error/ErrorMessage";
import { removeAcentosEMaiusculas } from "../stringFunctions";
import { FormComponent } from "../AdminPages_components/Forms/Forms/FormComponent";
import { AxiosResponse } from "axios";
import { DeleteTable } from '../AdminPages_components/deleteTable/deleteTable/DeleteTable'
import { editItemInterface, AccountsResponse, editPaymentsInterface, AccountsShow, acountAndTotal, externalGetAccountsData, externalCreateNewAccount, externalPostPayment, externalGetItems, externalDeleteItem, externalDeletePayments } from "./AccountsPageFunctions";
import { getAccountItemsById, getPaymentsById } from './AccountsPageFunctions'
import { AccountBillWindow } from "./AccountBillWindow";


export function AccountsPage() {

    const [accountsData, setAccountsData] = useState<AccountsResponse[]>([]), [payment, setPayments] = useState(0), [getTargetId, setTargetId] = useState(''), [openAccountCreateForm, setOpenAccountCreateForm] = useState(false), [load, setLoad] = useState(false), [selectedAccountData, setSelectedAccountData] = useState<IAccount>(), [selectedAccountWindowOpen, setSelectedAccountWindowOpen] = useState(false), [openPaymentWindow, setOpenPaymentWindow] = useState(false), [deleteItemActive, setDeleteItemActive] = useState(false), [deletePaymentActive, setDeletePaymentActive] = useState(false), [createAccountId, setCreateAccountId] = useState('');


    useLayoutEffect(() => {
        getAccounts();
    }, []);

    const getAccounts = () => {
        setLoad(true);
        AccountsServices.getAccounts()
            .then((response: AxiosResponse<AccountsResponse>) => {
                setAccountsData(Object.values(response.data));
                setLoad(false);
            })
            .catch((error) => {
                console.log(error);
                setLoad(false);
            });
    };

    const getAccountsData = (): AccountsShow[] => {
        return externalGetAccountsData(accountsData)
    };

    const createNewAccount = (_: React.FormEvent<HTMLFormElement>) => {
        return externalCreateNewAccount(createAccountId, getAccounts)
    }

    const postPayment = (_: React.FormEvent<HTMLFormElement>) => {
        return externalPostPayment(getTargetId, payment, getAccounts)
    }

    const getItems = (args: AccountsShow) => {
        return externalGetItems(args, setLoad, setSelectedAccountData, setSelectedAccountWindowOpen)
    }

    const deleteItem = (_id: string) => {
        return externalDeleteItem(_id, getTargetId, getAccounts)
    }

    const deletePayment = (_id: string) => {
        return externalDeletePayments(_id, getTargetId, getAccounts)
    }

    const paymentInput = {
        label: 'Insira o valor do pagamento:',
        name: 'payment',
        id: 'payment',
        inputType: 'number',
        maxLen: 8,
        minLen: 1,
        placeHolder: '5.00',
        onChangeFunction: setPayments,
    }

    const createAccountInput = {
        label: 'Insira o ID do funcionário:',
        name: 'account_id',
        id: 'account_id',
        inputType: 'text',
        maxLen: 100,
        minLen: 1,
        placeHolder: '_id',
        onChangeFunction: setCreateAccountId,
    }

    const tableButtons = [{
        text: 'Adicionar Pagamento',
        method: () => setOpenPaymentWindow(!openPaymentWindow),
        color: 'green',

    }, {
        text: 'Ver conta',
        method: getItems,
        color: 'green',
    },
    {
        text: 'Excluir items',
        method: () => { setDeleteItemActive(!deleteItemActive) },
        color: 'red',
    },
    {
        text: 'Excluir pagamentos',
        method: () => { setDeletePaymentActive(!deletePaymentActive) },
        color: 'red',
    },
    ]

    return (
        <>
            {!load && !selectedAccountWindowOpen && !openPaymentWindow && <div className=" sticky w-full bg-gradient-to-b from-black to-neutral-900 h-16 flex justify-end items-center">
                <button onClick={() => setOpenAccountCreateForm(!openAccountCreateForm)} className=" mr-4 border px-4 py-2 text-xl border-green-400 text-green-400">Criar nova conta</button>
            </div>}

            {
                openAccountCreateForm && <FormComponent title={"Insira o id do usuário"} submitFunction={createNewAccount} cancelFunction={() => setOpenAccountCreateForm(!openAccountCreateForm)} inputs={[createAccountInput]} />
            }

            {
                openPaymentWindow &&
                <FormComponent title={"Insira o valor"} submitFunction={postPayment} cancelFunction={() => setOpenPaymentWindow(false)} inputs={[paymentInput]} />
            }

            {(selectedAccountWindowOpen && selectedAccountData != undefined) && <AccountBillWindow
                selectedAccountData={selectedAccountData}
                setSelectedAccountWindowOpen={setSelectedAccountWindowOpen}
                setSelectedAccountData={setSelectedAccountData}
            />}


            {load && <Loader />}

            {deleteItemActive &&
                <DeleteTable<editItemInterface> getMethod={() => getAccountItemsById(getTargetId)} headers={['Id', 'Quantidade', 'Data', 'Nome do produto', 'Preço']} deleteFunction={deleteItem} cancelFunction={() => setDeleteItemActive(!deleteItemActive)} />
            }

            {deletePaymentActive &&
                <DeleteTable<editPaymentsInterface> getMethod={() => getPaymentsById(getTargetId)} headers={['ID', 'Data', 'Valor', 'Ações']} deleteFunction={deletePayment} cancelFunction={() => setDeletePaymentActive(!deletePaymentActive)} />
            }

            {
                !load && !selectedAccountWindowOpen && !openPaymentWindow && !deleteItemActive && !deletePaymentActive &&
                <TableComponent<AccountsShow>
                    data={getAccountsData()}
                    headers={['#', 'id', 'id do usuário', 'nome do usuário', 'Valor na conta', 'Valor pago']} onEdit={null} onDelete={null}
                    setTargetId={setTargetId}
                    otherButtons={tableButtons}
                />
            }
        </>
    );
}

