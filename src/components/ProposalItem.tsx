import { useContext } from 'react';
import TalentLayerContext from '../context/talentLayer';
import { renderTokenAmount } from '../utils/conversion';
import { IProposal, ProposalStatusEnum } from '../types';
import { formatDate } from '../utils/dates';
import ValidateProposalModal from './Modal/ValidateProposalModal';
import useServiceById from '../hooks/useServiceById';

function ProposalItem({ proposal }: { proposal: IProposal }) {
  const { user, account } = useContext(TalentLayerContext);
  const service = useServiceById(proposal.service.id);

  if (!service) {
    return null;
  }

  const isBuyer = user?.id === proposal.service.buyer.id;

  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-200'>
      <div className='flex flex-col items-top justify-between gap-4 w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start w-full  relative'>
            <img
              src={`/default-avatar-${Number(proposal.seller.id) % 11}.jpeg`}
              className='w-10 mr-4 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium'>
                {proposal.seller.handle} - {service.description?.title}
              </p>
              <p className='text-xs text-gray-500'>
                Proposal created the {formatDate(Number(proposal.createdAt) * 1000)}
              </p>
            </div>

            <span className='absolute right-0 inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-800'>
              {proposal.status}
            </span>
          </div>

          <div className=' border-t border-gray-100 w-full'>
            <p className='text-sm text-gray-500 mt-4'>
              <strong>Message:</strong> {proposal.description?.about}
            </p>
            <p className='text-sm text-gray-500 mt-4'>
              <strong>Expiration Date:</strong> {formatDate(Number(proposal.expirationDate) * 1000)}
            </p>
          </div>
        </div>
        <div className='flex flex-row gap-4 justify-between items-center border-t border-gray-100 pt-4'>
          <p className='text-gray-900 font-bold line-clamp-1 flex-1'>
            {renderTokenAmount(proposal.rateToken, proposal.rateAmount)}
          </p>
          {account && isBuyer && proposal.status === ProposalStatusEnum.Pending && (
            <ValidateProposalModal proposal={proposal} account={account} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProposalItem;
