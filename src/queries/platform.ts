import { processRequest, processRequestByChain } from '../utils/graphql';

const platformFields = `
  id
  name
  address
  arbitrationFeeTimeout
  arbitrator
  arbitratorExtraData
  servicePostingFee
  originServiceFeeRate
  originValidatedProposalFeeRate
  proposalPostingFee
  cid
  createdAt
  updatedAt
`;

const platformDescriptionFields = `
  id
  about
  image_url
  video_url
  website
`;

export const getPlatform = (id: string | undefined): Promise<any> => {
  const query = `
    {
      platform(id: ${id}) {
        ${platformFields}
        description {
          ${platformDescriptionFields}
        }
      }
    }
    `;
  return processRequest(query);
};

export const getPlatformByAddress = (address: string | undefined): Promise<any> => {
  const query = `
    {
      platforms(where: {address: "${address}"}) {
        ${platformFields}
        description {
          ${platformDescriptionFields}
        }
      }
    }
    `;
  return processRequest(query);
};

export const getTotalPlatformGains = (id: string): Promise<any> => {
  const query = `
    {
      platform(id: ${id}) {
        totalPlatformGains {
          totalPlatformFeeGain
          totalOriginPlatformFeeGain
          token {
            id
            symbol
            name
            decimals
            address
          }
        }
      }
    }
    `;
  return processRequest(query);
};

export const getPlatformClaimedFees = (id: string): Promise<any> => {
  const query = `
    {
      platform(id: ${id}) {
        feeClaims {
          id
          amount
          token {
            address
            symbol
          }
        }
      }
    }
    `;
  return processRequest(query);
};
