import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (blog, id) => {
  const response = await axios.put(`${baseUrl}/${id}`, blog);
  return response.data;
};

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };

  if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
    const response = await axios.delete(`${baseUrl}/${blog.id}`, config);
    return response.data;
  }
};


export default { getAll, create, setToken, update, remove };
