import  React from 'react';
import { TransactionState } from '../../types';
import PrimaryButton from '../buttons/PrimaryButton';

type StatusProps = {
    status: TransactionState;
};

const StatusOverlay: React.FC<StatusProps> = ({ status }) => {
    const showStatus = (status: TransactionState): boolean => {
        return status === TransactionState.APPROVED;
    };

    return showStatus(status)? (
        <div className='relative z-10' aria-labelledby='Transaction Approved' role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg p-8 flex justify-center flex-col">
                        <h5 className="text-center font-bold mb-4">Transaccion aprovadas</h5>
                        <p>Momento de mover los fondos</p>
                        <PrimaryButton className="mt-4" title="mover" callback={() => null}/>
                    </div>
                </div>
            </div>
        </div>
    ): null;
};
export default StatusOverlay;