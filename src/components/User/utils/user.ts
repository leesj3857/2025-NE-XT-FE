import axios from 'axios';
import { graphqlRequest } from '../../../api/graphqlClient';
export const updateUserName = async (newName: string, accessToken: string): Promise<string> => {
  const query = `
    mutation UpdateUsername($name: String!) {
      updateUsername(name: $name) {
        message
        name
      }
    }
  `;

  try {
    const response = await graphqlRequest(query, { name: newName }, accessToken );
    return response.updateUsername.name;
  } catch (error: any) {
    console.error('Update username error:', error);
    throw new Error(error.message || 'Failed to update name.');
  }
};

export const deleteAccount = async (accessToken: string): Promise<void> => {
  const query = `
    mutation {
      deleteAccount {
        message
      }
    }
  `;

  try {
    await graphqlRequest(query, {}, accessToken);
  } catch (error: any) {
    console.error('Delete account error:', error);
    throw new Error(error.message || 'Failed to delete account.');
  }
};
