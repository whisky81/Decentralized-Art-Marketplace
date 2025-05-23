import { useContext } from "react";
import { PEContext } from "../provider/PEProvider";

export const usePE = () => {
    const {
        pinata,
        provider,
        signer,
        account,
        contract,
        starting,
        error
    } = useContext(PEContext);

    return {
        pinata,
        provider,
        signer,
        account,
        contract,
        starting,
        error
    };
}