import { PinataSDK } from "pinata";
import { useState, useEffect, useCallback, createContext } from "react";
import { getEthersProvider, getContract } from "../api/utils";

export const PEContext = createContext({
    pinata: null,
    provider: null,
    signer: null,
    account: null,
    contract: null,
    starting: true,
    error: false
});


export const PEProvider = ({ children }) => {
    const [pinata, setPinata] = useState(null)
    const [starting, setStarting] = useState(true)
    const [error, setError] = useState(false);
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [account, setAccount] = useState(null)
    const [contract, setContract] = useState(null)

    const init = useCallback(async () => {
        try {
            const innerPinata = new PinataSDK({
                pinataJwt: "",
                pinataGateway: import.meta.env.VITE_GATEWAY_URL
            })

            const innerProvider = await getEthersProvider()
            const innerSigner = await innerProvider.getSigner()
            const innerAccount = await innerSigner.getAddress()
            const innerContract = await getContract(innerSigner)  

            setPinata(innerPinata);
            setStarting(false);
            setProvider(innerProvider)
            setSigner(innerSigner)
            setAccount(innerAccount)
            setContract(innerContract)
        } catch (error) {
            console.error(error)
            setError(true)
        }
    }, []);


    useEffect(() => {
        init();
    }, [])

    return (<PEContext.Provider
        value={{
            pinata,
            provider,
            signer,
            account,
            contract,
            starting,
            error
        }}
    >
        {children}
    </PEContext.Provider>)
}
