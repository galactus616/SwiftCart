import axios from 'axios';

const API_BASE = 'https://swiftcart-asmy.onrender.com/api/auth';

export async function sendOtp(phone) {
  try {
    const res = await axios.post(`${API_BASE}/send-otp`, { phone });
    return res.data; // { message, devOtp? }
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || 'Failed to send OTP'
    );
  }
}

export async function verifyOtp(phone, otp) {
  try {
    const res = await axios.post(
      `${API_BASE}/verify-otp`,
      { phone, otp },
      { withCredentials: true }
    );
    return res.data; // { message, user }
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || 'Failed to verify OTP'
    );
  }
}

export async function logout() {
  return axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
}

export async function getProfile() {
  return axios.get(`${API_BASE}/profile`, { withCredentials: true });
} 
