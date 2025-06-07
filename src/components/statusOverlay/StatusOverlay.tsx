import  React, { useState, useEffect } from 'react';
import { TransactionState } from '../../types';
import PrimaryButton from '../buttons/PrimaryButton';
import i18n from '../../configs/i18n';

type StatusProps = {
    status: TransactionState;
    lastUrl: string;
};

type TransitionalTransationState = TransactionState.APPROVED | TransactionState.PROCESSING

const WAIT_TIMEOUT = 15000;
const STATE_TEXT = {
    [TransactionState.APPROVED]: {
        title: "transactionApproved",
        content: "sendFunds",
    },
    [TransactionState.PROCESSING]: {
        title: "transactionPending",
        content: "transactionToApprove",
    }
}

const StatusOverlay: React.FC<StatusProps> = ({ status, lastUrl }) => {
    const [ focusedApp, focusApp ] = useState(true);
    console.log("lastUrl", lastUrl);
    const showStatus = (status: TransactionState): boolean => {
        return !focusedApp && (
            status === TransactionState.APPROVED || status === TransactionState.PROCESSING
        );
    };

    useEffect(() => {
        console.log("lastUrl effect", lastUrl);
        focusApp(false);
    }, [lastUrl]);
    
    const redirectWallet = () => {
        focusApp(true);
        window.open(lastUrl, "__blank");
        setTimeout(() => focusApp(false), WAIT_TIMEOUT);
    }

    const stateText = STATE_TEXT[status as TransitionalTransationState] || {text: "undefined", content: "undefined"}

    return showStatus(status)? (
        <div className='relative z-10' aria-labelledby='Transaction Approved' role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-8 flex justify-center flex-col">
                        <h5 className="text-center font-bold mb-4">{i18n.t(stateText.title)}</h5>
                        <p>{i18n.t(stateText.content)}</p>
                        <PrimaryButton className="mt-4" title={i18n.t("goToWallet")} callback={redirectWallet}/>
                    </div>
                </div>
            </div>
        </div>
    ): null;
};
export default StatusOverlay;