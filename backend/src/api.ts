export interface CatAPIResponse {
  id: string,
  url: string,
  width: number,
  height: number,
}

const urlCatAPI = "https://api.thecatapi.com"

/**
 * Fetches random cats from the Cat API
 * @param amount number of random cats to fetch
 * @returns
 */
export const fetchCats = async (amount: number): Promise<Array<CatAPIResponse>> => {
  const response = await fetch(`${urlCatAPI}/v1/images/search?limit=${amount}`)
  return await response.json();
}
