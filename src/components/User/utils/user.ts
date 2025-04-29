import axios from 'axios';

export const updateUserName = async (newName: string, accessToken: string): Promise<string> => {
  try {
    const response = await axios.patch(
      'https://two025-ne-xt-be.onrender.com/api/user/update-name/',
      { name: newName },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.name;
  } catch (error: any) {
    const errMsg = error.response?.data?.error || 'Failed to update name.';
    throw new Error(errMsg);
  }
};

export const deleteAccount = async (accessToken: string): Promise<void> => {
  try {
    await axios.delete('https://two025-ne-xt-be.onrender.com/api/user/delete-account/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    const errMsg = error.response?.data?.error || 'Failed to delete account.';
    throw new Error(errMsg);
  }
};
