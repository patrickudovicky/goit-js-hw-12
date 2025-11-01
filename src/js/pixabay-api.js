import axios from "axios";

export const PER_PAGE = 15;

export async function getImgRequest(query, page = 1)  {
const parameters = {
    key : '52994233-7ffb60f08ba14b4da4bef7a73',
    q : query,
    image_type : 'photo',
    orientation : 'horizontal',
    safesearch : true,
    page: page,
    per_page: PER_PAGE,
};
const response = await axios.get('https://pixabay.com/api/', { params : parameters});
  return response.data;
}