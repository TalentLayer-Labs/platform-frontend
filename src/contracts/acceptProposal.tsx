import { getParsedEthersError } from '@enzoferey/ethers-error-parser';
import { EthersError } from '@enzoferey/ethers-error-parser/dist/types';
import { Provider } from '@wagmi/core';
import { Contract, ethers, Signer } from 'ethers';
import { toast } from 'react-toastify';
import TransactionToast from '../components/TransactionToast';
import { config } from '../config';
import ERC20 from './ABI/ERC20.json';
import TalentLayerEscrow from './ABI/TalentLayerEscrow.json';

export const validateProposal = async (
  signer: Signer,
  provider: Provider,
  serviceId: string,
  proposalId: string,
  rateToken: string,
  cid: string,
  value: ethers.BigNumber,
): Promise<void> => {
  const talentLayerEscrow = new Contract(
    config.contracts.talentLayerEscrow,
    TalentLayerEscrow.abi,
    signer,
  );

  try {
    if (rateToken === ethers.constants.AddressZero) {
      const tx1 = await talentLayerEscrow.createETHTransaction(
        'meta_evidence',
        parseInt(serviceId, 10),
        parseInt(proposalId, 10),
        cid,
        {
          value,
        },
      );

      const receipt1 = await toast.promise(provider.waitForTransaction(tx1.hash), {
        pending: {
          render() {
            return (
              <TransactionToast
                message='Your validation is in progress'
                transactionHash={tx1.hash}
              />
            );
          },
        },
        success: 'Transaction validated',
        error: 'An error occurred while validating your transaction',
      });
      if (receipt1.status !== 1) {
        throw new Error('Approve Transaction failed');
      }
    } else {
      // Token transfer approval for escrow contract
      const ERC20Token = new Contract(rateToken, ERC20.abi, signer);

      const balance = await ERC20Token.balanceOf(signer.getAddress());
      if (balance.lt(value)) {
        throw new Error('Insufficient balance');
      }

      const allowance = await ERC20Token.allowance(
        signer.getAddress(),
        config.contracts.talentLayerEscrow,
      );

      if (allowance.lt(value)) {
        const tx1 = await ERC20Token.approve(config.contracts.talentLayerEscrow, value);
        const receipt1 = await toast.promise(provider.waitForTransaction(tx1.hash), {
          pending: {
            render() {
              return (
                <TransactionToast
                  message='Your approval is in progress'
                  transactionHash={tx1.hash}
                />
              );
            },
          },
          success: 'Transaction validated',
          error: 'An error occurred while updating your profile',
        });
        if (receipt1.status !== 1) {
          throw new Error('Approve Transaction failed');
        }
      }

      const tx2 = await talentLayerEscrow.createTokenTransaction(
        'meta_evidence',
        parseInt(serviceId, 10),
        parseInt(proposalId, 10),
        cid,
      );
      const receipt2 = await toast.promise(provider.waitForTransaction(tx2.hash), {
        pending: {
          render() {
            return (
              <TransactionToast
                message='Your validation is in progress'
                transactionHash={tx2.hash}
              />
            );
          },
        },
        success: 'Transaction validated',
        error: 'An error occurred while updating your profile',
      });
      if (receipt2.status !== 1) {
        throw new Error('Transaction failed');
      }
    }
  } catch (error: any) {
    let errorMessage;
    if (typeof error?.code === 'string') {
      const parsedEthersError = getParsedEthersError(error as EthersError);
      errorMessage = `${parsedEthersError.errorCode} - ${parsedEthersError.context}`;
    } else {
      errorMessage = error?.message;
    }
    toast.error(errorMessage);
  }
};
