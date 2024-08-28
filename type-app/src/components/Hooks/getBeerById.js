import typeApi from "../../api/type-server";

const getBeerById = async (beerId, beers) => {
    return beers[beerId] || await typeApi.get(`/beer/${beerId}`).then((res) => {
        return res.data[0];
    }).catch(err => {
        throw err;
    })

}
export default getBeerById;
