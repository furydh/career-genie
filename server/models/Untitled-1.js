// Replace 'yourToken' with the actual token from localStorage or context
const formData = new FormData();
formData.append('resume', file);

await axios.post(
  'http://localhost:5001/api/resume/upload',
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}` // or your auth context
    }
  }
);