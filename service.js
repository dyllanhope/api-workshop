module.exports = (pool) => {
    const saveFavourite = async (record) => {
        let data = [
            record.make,
            record.model,
            record.color,
            record.price,
            record.reg_number
        ];
        let check = await pool.query('SELECT * FROM favourites WHERE reg_number = $1', [record.reg_number]);
        if (check.rowCount === 0) {
            await pool.query('INSERT INTO favourites(make,model,color,price,reg_number) VALUES($1,$2,$3,$4,$5)', data);
        }
    }
    const removeFavourite = async (reg) => {
        await pool.query('DELETE FROM favourites WHERE reg_number = $1', [reg]);
        let newList = await pool.query('SELECT * FROM favourites');
        return newList.rows;
    }
    const listFavourites = async () => {
        let list = await pool.query('SELECT * FROM favourites');
        return list.rows;
    }

    return {
        saveFavourite,
        listFavourites,
        removeFavourite
    }
}