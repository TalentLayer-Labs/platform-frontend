import { NavLink } from 'react-router-dom';
import Loading from './Loading';
import usePlatformDetails from '../hooks/usePlatformDetails';

function PlatformDetail({ platformId }: { platformId: string }) {
  const platform = usePlatformDetails(platformId);
  const platformFee = Number(platform?.fee) / 100;

  if (!platform) {
    return <Loading />;
  }

  return (
    <div className='flex flex-col rounded-xl p-4 border border-gray-200'>
      <div className='flex items-top justify-between w-full'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start mb-4'>
            <img
              src={`/default-avatar-${Number(platform?.id ? platform.id : '1') % 11}.jpeg`}
              alt={`${platform?.name} icon`}
              className='w-10 mr-4 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium'>{platform?.name || '-'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className=' border-t border-gray-100 pt-4 w-full'>
        <p className='text-sm text-gray-500 mt-4'>
          <strong>Fee Rate:</strong> {platformFee.toString()} %
        </p>
      </div>
      <div className=' border-t border-gray-100 pt-4 w-full mt-4'>
        <div className='flex flex-row gap-4 justify-end items-center'>
          <NavLink
            className='text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white px-5 py-2 rounded-lg'
            to={`/configuration/edit`}>
            Edit platform configuration
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default PlatformDetail;
